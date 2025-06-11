/*
 * Copyright (c) 2023-2025 KCai Technology (https://kcaitech.com). All rights reserved.
 *
 * This file is part of the Vextra project, which is licensed under the AGPL-3.0 license.
 * The full license text can be found in the LICENSE file in the root directory of this source tree.
 *
 * For more information about the AGPL-3.0 license, please visit:
 * https://www.gnu.org/licenses/agpl-3.0.html
 */

import { convertGetFileResponse } from "../figmcpconvert";
import { IDocument } from "./document";
import { openDocument } from "./open";
import { Document, Coop } from "@kcdesign/data";
export class DocumentLocal implements IDocument {
    private document?: Document;
    private repo?: Coop.CoopRepository;
    private filePath: string;
    constructor(filePath: string) {
        this.filePath = filePath;
    }
    public async load() {
        const fmt = this.filePath.split('.').pop();
        if (!fmt || (fmt !== 'fig' && fmt !== 'sketch' && fmt !== 'vext' && fmt !== 'moss')) {
            throw new Error('文件格式不支持');
        }
        const document = await openDocument({ source: 'file', file: new File([], this.filePath), fmt: fmt });
        if (!document) throw new Error('文件打开失败，请稍后再试');
        
        this.document = document.data;
        this.repo = document.cooprepo;
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