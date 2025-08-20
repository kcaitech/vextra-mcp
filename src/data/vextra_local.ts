/*
 * Copyright (c) 2023-2025 KCai Technology (https://kcaitech.com). All rights reserved.
 *
 * This file is part of the Vextra project, which is licensed under the AGPL-3.0 license.
 * The full license text can be found in the LICENSE file in the root directory of this source tree.
 *
 * For more information about the AGPL-3.0 license, please visit:
 * https://www.gnu.org/licenses/agpl-3.0.html
 */

import fs from "fs";
import { SimpleVext } from "@kcaitech/vextra-core";
import { IDocument, DocumentLocal } from "./source";
import path from "path";
import { Canvas } from "skia-canvas";
import { IO } from "@kcaitech/vextra-core";

type Document = SimpleVext.Document;
type Shape = SimpleVext.Shape;
const serializeNode = SimpleVext.serializeNode;
const serializeDocument = SimpleVext.serializeDocument;


function saveFile(
    fileName: string,
    localPath: string,
    data: Uint8Array,
): string {
    const fullPath = path.join(localPath, fileName);
    // Ensure local path exists
    if (!fs.existsSync(localPath)) {
        fs.mkdirSync(localPath, { recursive: true });
    }
    fs.writeFileSync(fullPath, data);
    return fullPath;
}

type FetchImageParams = {
    pageId: string;
    /**
     * The Node in Vextra that will either be rendered or have its background image downloaded
     */
    nodeId: string;
    /**
     * The local file name to save the image
     */
    fileName: string;
    /**
     * The file mimetype for the image
     */
    fileType: "png" | "svg";
};

type FetchImageFillParams = {
    /**
   * The local file name to save the image
   */
    fileName: string;
    /**
     * Required to grab the background image when an image is used as a fill
     */
    imageRef: string;
};

function getFilePath(filePath: string): string {
    if (filePath.startsWith("file://")) {
        filePath = filePath.replace("file://", "/");
        // 去除fileKey前面多余的/，只保留一个/
        filePath = filePath.replace(/^\/+/, "/");
    }
    return filePath;
}

export class VextraDataService {
    private documentMap = new Map<string, IDocument>();

    async getDocument(filePath: string): Promise<IDocument> {
        if (this.documentMap.has(filePath)) {
            return this.documentMap.get(filePath)!;
        }
        let document: IDocument;

        filePath = getFilePath(filePath);
        if (!fs.existsSync(filePath)) {
            throw new Error("File not found");
        }

        document = new DocumentLocal(filePath);

        await document.load();
        this.documentMap.set(filePath, document);
        return document;
    }

    // 获取节点填充图片
    async getImageFills(
        filePath: string,
        nodes: FetchImageFillParams[],
        localPath: string,
    ): Promise<string[]> {
        if (nodes.length === 0) return [];
        const document = await this.getDocument(filePath);
        const data = document.data();
        const mediaMgr = data.mediasMgr;

        let promises: Promise<string>[] = [];

        promises = nodes.map(async ({ imageRef, fileName }) => {

            const image = await mediaMgr.get(imageRef)
            if (!image) {
                return "";
            }
            // 保存image到本地
            return saveFile(fileName, localPath, image.buff);
        });
        return Promise.all(promises);
    }

    // 将节点绘制成图片
    async getImages(
        filePath: string,
        nodes: FetchImageParams[],
        localPath: string,
        pngScale: number,
        svgOptions: {
            outlineText: boolean;
            includeId: boolean;
            simplifyStroke: boolean;
        },
    ): Promise<string[]> {
        const document = await this.getDocument(filePath);


        const result: Map<string, string> = new Map();
        // 获取所有节点
        const tasks = nodes.map(async (node) => {
            const view = await document.getNodeView(node.nodeId, node.pageId);
            if (!view) return;
            if (node.fileType === 'png') {
                const tempCanvas = await IO.exportImg(view, pngScale) as Canvas | undefined
                if (!tempCanvas) return;
                // 使用 skia-canvas 的 png 属性生成 PNG
                const buffer = await tempCanvas.png;
                // 保存为PNG文件
                const path = saveFile(node.fileName, localPath, buffer);
                result.set(node.nodeId, path);
            }
            else if (node.fileType === 'svg') {
                const svg = await IO.exportSvg(view)
                const path = saveFile(node.fileName, localPath, Buffer.from(svg));
                result.set(node.nodeId, path);
            }
        });

        await Promise.all(tasks);

        const downloads = nodes.map(({ nodeId }) => {
            return result.get(nodeId);
        });

        return downloads.filter((url) => !!url) as string[];
    }

    // 获取整个文件
    async getFile(filePath: string, depth?: number | null): Promise<Document> {
        try {
            const document = await this.getDocument(filePath);
            if (!document) {
                throw new Error("Failed to get document");
            }
            const simplifiedResponse = await serializeDocument(document.data(), depth ?? undefined);

            return simplifiedResponse;
        } catch (e) {
            console.error("Failed to get file:", e);
            throw e;
        }
    }

    // 获取单个节点
    async getNode(filePath: string, pageId: string, nodeId: string, depth?: number | null): Promise<Shape> {
        const document = await this.getDocument(filePath);
        if (!document) {
            throw new Error("Failed to get document");
        }
        const view = await document.getNodeView(nodeId, pageId);
        if (!view) {
            throw new Error("Failed to get node view");
        }

        const simplifiedResponse = await serializeNode(view, depth ?? undefined);

        return simplifiedResponse;
    }

    async getPageInfos(filePath: string): Promise<{ id: string, name: string, nodeCount: number }[]> {
        const document = await this.getDocument(filePath);
        const pages = document.data().pagesList.map(page => document.getNodeView(page.id, page.id));
        const pageViews = await Promise.all(pages);
        const pageInfos = pageViews.filter(page => page !== undefined).map(page => {
            return {
                id: page.id,
                name: page.name,
                nodeCount: page.nodeCount,
            }
        });
        return pageInfos;
    }
}
