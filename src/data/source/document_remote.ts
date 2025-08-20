/*
 * Copyright (c) 2023-2025 KCai Technology (https://kcaitech.com). All rights reserved.
 *
 * This file is part of the Vextra project, which is licensed under the AGPL-3.0 license.
 * The full license text can be found in the LICENSE file in the root directory of this source tree.
 *
 * For more information about the AGPL-3.0 license, please visit:
 * https://www.gnu.org/licenses/agpl-3.0.html
 */

import { WSClient, HttpCode, NetworkStatusType } from '@kcaitech/vextra-server-client';
import { openDocument } from "./open";
import { getWsUrl } from "../../config";
import { IO, Document, layoutShape, DViewCtx, PageView, ShapeView, Repo, TransactDataGuard } from "@kcaitech/vextra-core";
import { IDocument } from "./document";
import { CoopRepository } from '@kcaitech/vextra-coop';
import { getStorageClass, StorageOptions } from '@/providers/storage';


export interface IContext {
    get data(): Document;
}

export class StorageBridge implements IO.IStorage {
    private _impl: IO.IStorage;
    constructor(impl: IO.IStorage) {
        this._impl = impl;
    }
    update(impl: IO.IStorage) {
        this._impl = impl;
    }
    get(uri: string, versionId?: string): Promise<Uint8Array> {
        return this._impl.get(uri, versionId);
    }
    put(uri: string, data: Uint8Array, contentType?: string): Promise<void> {
        return this._impl.put(uri, data, contentType);
    }
}

interface _Context {
    selection: {
        selectedPage?: { id: string };
        selectedShapes: Array<{ id: string }>;
        hoveredShape?: { id: string };
        textSelection: {
            cursorStart?: number;
            cursorEnd?: number;
            cursorAtBefore?: boolean;
        };
        watch: (callback: (type: string) => void) => void;
    };
    lastRemoteCmdVersion: () => number | undefined;
}
class MockContext implements _Context {
    private _repo: CoopRepository
    constructor(repo: CoopRepository) {
        this._repo = repo;
    }
    selection = {
        selectedPage: undefined,
        selectedShapes: [],
        hoveredShape: undefined,
        textSelection: {
            cursorStart: undefined,
            cursorEnd: undefined,
            cursorAtBefore: false,
        },
        watch: (callback: (type: string) => void) => { },
    };
    lastRemoteCmdVersion = () => 0;
}

export class DocumentRemote implements IDocument {

    private storageBridge?: StorageBridge;
    private ws: WSClient;
    private fileKey: string;
    private document?: Document;
    private repo?: Repo.IRepository;
    private _closed = false;
    private from: 'server' | 'client';
    private _onClose?: (fileKey: string) => void;
    private pageViews: Map<string, { ctx: DViewCtx, view: PageView }> = new Map();

    constructor(token: string, fileKey: string, from: 'server' | 'client') {
        this.ws = new WSClient(getWsUrl(), token, from);
        this.fileKey = fileKey;
        this.from = from;
        console.log(`DocumentRemote constructor ${this.fileKey}`);
    }

    onClose(onClose: (fileKey: string) => void) {
        this._onClose = onClose;
        const onChange = (status: NetworkStatusType) => {
            if (status !== NetworkStatusType.Offline) return;
            this.close('Network disconnected');
        }
        this.ws.connect.addOnChange(onChange);
    }

    close(msg: string) {
        if (this._closed) return;
        console.log(`DocumentRemote close ${this.fileKey}: ${msg}`);
        this._closed = true;
        try {
            this.ws.close();
        } catch (error) {
            console.error(`Error closing ws: ${error}`);
        }
        this._onClose?.(this.fileKey);
    }

    public async load() {

        const ret = await this.ws.bind(this.fileKey);

        if (ret.code === HttpCode.StatusContentReviewFail) {
            throw new Error('文件正在审核中，请稍后再试');
        }
        if (ret.code === HttpCode.StatusNotFound) {
            throw new Error('文件不存在或已被删除');
        }

        if (ret.code === HttpCode.StatusForbidden) {
            throw new Error('文件已被锁定或没有权限访问');
        }

        const docInfoData = ret.data.doc_info;
        const docKeyData = ret.data.access_key;

        const perm = docInfoData.document_permission.perm_type;
        if (perm === 0) {
            throw new Error('文件已被锁定或没有权限访问');
        }

        const storageOptions: StorageOptions = {
            endPoint: docKeyData.endpoint,
            region: docKeyData.region,
            accessKey: docKeyData.access_key,
            secretKey: docKeyData.secret_access_key,
            sessionToken: docKeyData.session_token,
            bucketName: docKeyData.bucket_name,
            secure: false,
            internal: this.from === 'server',
            cname: true,
        }
        const storage = new (await getStorageClass(docKeyData.provider))(storageOptions);
        const path = docInfoData.document.path;
        const versionId = docInfoData.document.version_id ?? "";

        this.storageBridge = new StorageBridge(storage);
        const repoCreator = (data: Document, guard: TransactDataGuard) => new CoopRepository(data, guard);
        const result = await openDocument({ source: 'storage', storage: this.storageBridge, path, fid: "", versionId }, repoCreator);
        if (!result) throw new Error('文件打开失败，请稍后再试');

        const repo = result.cooprepo as CoopRepository
        repo.setNet(this.ws);

        const waitCommandBack = (() => { // 等待命令返回
            return new Promise<void>((resolve) => {
                this.ws.watchCmds((cmds) => {
                    resolve();
                })
            });
        })();
        await this.ws.start(new MockContext(repo));
        await waitCommandBack
        if (!result) throw new Error('文件打开失败，请稍后再试');

        this.document = result.data;
        this.repo = result.cooprepo;
    }

    public data() {
        if (!this.repo) throw new Error('文件未加载');
        if (!this.document) throw new Error('文件未加载');
        return this.document;
    }

    public async getPageView(pageId: string): Promise<PageView | undefined> {
        if (!this.repo) throw new Error('文件未加载');
        if (!this.document) throw new Error('文件未加载');

        if (this.pageViews.has(pageId)) {
            return this.pageViews.get(pageId)!.view;
        }
        const page = await this.document.pagesMgr.get(pageId)
        if (!page) return;
        const view = layoutShape(page);
        this.pageViews.set(pageId, { ctx: view.ctx, view: view.view as PageView });
        return view.view as PageView;
    }

    public async getNodeView(nodeId: string, pageId: string): Promise<ShapeView | undefined> {
        if (!this.repo) throw new Error('文件未加载');
        if (!this.document) throw new Error('文件未加载');
        const pageView = await this.getPageView(pageId);
        if (nodeId === pageId) {
            return pageView;
        }
        return pageView?.getView(nodeId)
    }
}

