/*
 * Copyright (c) 2023-2025 KCai Technology (https://kcaitech.com). All rights reserved.
 *
 * This file is part of the Vextra project, which is licensed under the AGPL-3.0 license.
 * The full license text can be found in the LICENSE file in the root directory of this source tree.
 *
 * For more information about the AGPL-3.0 license, please visit:
 * https://www.gnu.org/licenses/agpl-3.0.html
 */

import { WSClient, HttpCode } from "./pal";
import { openDocument } from "./open";
import { WS_URL } from "../config";
import { IO, Document, Coop } from "@kcdesign/data";
import { IDocument } from "./document";
import { convertGetFileResponse } from "src/figmcpconvert";


export interface IContext {
    get data(): Document;
}
export type StorageOptions = {
    endPoint: string
    region: string
    accessKey: string
    secretKey: string
    sessionToken?: string | undefined
    bucketName: string
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

export type Provider = 'oss' | 'minio' | 's3'

export async function getStorageClass(provider: Provider): Promise<new (options: StorageOptions) => IO.IStorage> {
    let storage

    if (provider === 'oss') storage = (await import('./oss')).default;
    else if (provider === 'minio') storage = (await import('./s3')).default;
    else if (provider === 's3') storage = (await import('./s3')).default;
    else storage = (await import('./oss')).default;

    return storage
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
    private repo?: Coop.CoopRepository;
    constructor(token: string, fileKey: string) {
        this.ws = new WSClient(WS_URL, token);
        this.fileKey = fileKey;
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
        }
        const storage = new (await getStorageClass(docKeyData.provider))(storageOptions);
        const path = docInfoData.document.path;
        const versionId = docInfoData.document.version_id ?? "";

        this.storageBridge = new StorageBridge(storage);
        const result = await openDocument({ source: 'storage', storage: this.storageBridge, path, fid: "", versionId });
        if (!result) throw new Error('文件打开失败，请稍后再试');

        const repo = result.cooprepo
        repo.setNet(this.ws);
        const waitCommandBack = (() => {
            return new Promise<void>((resolve) => {
                this.ws.watchCmds((cmds) => {
                    resolve();
                })
            });
        })();
        await this.ws.start(new MockContext());
        await waitCommandBack
        if (!result) throw new Error('文件打开失败，请稍后再试');

        this.document = result.data;
        this.repo = result.cooprepo;
    }

    public getFileContext() {
        if (!this.repo) throw new Error('文件未加载');
        if (!this.document) throw new Error('文件未加载');

        const doc = this.document;

        const pages = doc.pagesMgr.keys.map((key) => doc.pagesMgr.getSync(key))

        const data = {
            id: doc.id,
            name: doc.name,
            role: 'owner',
            lastModified: '',
            editorType: 'figma',
            version: '',
            locked: false,
            visible: true,
            type: 'Document',
            pages,
        } as unknown as Document;

        return (convertGetFileResponse(data));
    }
}

