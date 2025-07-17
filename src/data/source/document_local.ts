/*
 * Copyright (c) 2023-2025 KCai Technology (https://kcaitech.com). All rights reserved.
 *
 * This file is part of the Vextra project, which is licensed under the AGPL-3.0 license.
 * The full license text can be found in the LICENSE file in the root directory of this source tree.
 *
 * For more information about the AGPL-3.0 license, please visit:
 * https://www.gnu.org/licenses/agpl-3.0.html
 */

import { IDocument } from "./document";
import { openDocument } from "./open";
import { Document, PageView, DViewCtx, layoutShape, ShapeView } from "@kcaitech/vextra-core";
import { supportedFormats, SupportedFormatsType } from "./consts";

export class DocumentLocal implements IDocument {
    private document?: Document;
    private filePath: string;
    private pageViews: Map<string, {ctx: DViewCtx, view: PageView}> = new Map();

    constructor(filePath: string) {
        this.filePath = filePath;
    }
    public async load() {
        const fmt = this.filePath.split('.').pop();
        if (!fmt || !supportedFormats.includes(fmt)) {
            throw new Error('文件格式不支持');
        }
        
        const document = await openDocument(this.filePath, fmt as SupportedFormatsType);
        if (!document) throw new Error('文件打开失败，请稍后再试');
        
        this.document = document
    }
    public data() {
        if (!this.document) throw new Error('文件未加载');
        return this.document;
    }

    public async getPageView(pageId: string): Promise<PageView> {
        if (!this.document) throw new Error('文件未加载');
        
        if (this.pageViews.has(pageId)) {
            return this.pageViews.get(pageId)!.view;
        }
        const page = await this.document.pagesMgr.get(pageId)
        if (!page) throw new Error('页面未找到');
        const view = layoutShape(page);
        this.pageViews.set(pageId, {ctx: view.ctx, view: view.view as PageView});
        return view.view as PageView;
    }

    public async getNodeView(nodeId: string, pageId: string): Promise<ShapeView | undefined> {
        if (!this.document) throw new Error('文件未加载');
        const pageView = await this.getPageView(pageId);
        if (nodeId === pageId) {
            return pageView;
        }
        return pageView?.getView(nodeId)
    }
}