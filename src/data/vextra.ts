import fs from "fs";
import { SimpleVext } from "@kcaitech/vextra-core";
import { IDocument } from "./source";
import { DocumentRemote } from "./source";
import path from "path";
import { Canvas } from "skia-canvas";
import { IO } from "@kcaitech/vextra-core";
import { getServerConfig } from "@/config";

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

const DOCUMENT_TIMEOUT = 1000 * 60 * 15; // 15 minutes

export class VextraDataService {
    private documentMap = new Map<string, DocumentRemote>();
    private documentTimestamp = new Map<string, number>();
    private readonly oauthToken: () => Promise<string>;
    public readonly startTime: number = Date.now();
    private documentCleanupInterval: NodeJS.Timeout | null = null;

    constructor(vextraOAuthToken: () => Promise<string>) {
        this.oauthToken = vextraOAuthToken;
        this.documentCleanupInterval = setInterval(() => {
            Array.from(this.documentTimestamp.entries()).forEach(([fileKey, timestamp]) => {
                if (Date.now() - timestamp > DOCUMENT_TIMEOUT) {
                    const document = this.documentMap.get(fileKey);
                    if (document) document.close('timeout');
                }
            });
        }, DOCUMENT_TIMEOUT);
    }

    close() {
        Array.from(this.documentMap.values()).forEach(document => {
            document.close('Service close');
        });
        this.documentMap.clear();
        this.documentTimestamp.clear();
        if (this.documentCleanupInterval) {
            clearInterval(this.documentCleanupInterval);
            this.documentCleanupInterval = null;
        }
    }

    private updateDocumentTimestamp(fileKey: string) {
        this.documentTimestamp.set(fileKey, Date.now());
    }

    async getDocument(fileKey: string): Promise<IDocument> {
        this.updateDocumentTimestamp(fileKey);
        if (this.documentMap.has(fileKey)) {
            return this.documentMap.get(fileKey)!;
        }

        const token = await this.oauthToken();
        const document = new DocumentRemote(token, fileKey, getServerConfig().at);
        document.onClose((fileKey) => {
            this.documentMap.delete(fileKey);
            this.documentTimestamp.delete(fileKey);
        });

        await document.load();
        this.documentMap.set(fileKey, document);
        return document;
    }

    // 获取节点填充图片
    async getImageFills(
        fileKey: string,
        nodes: FetchImageFillParams[],
        localPath: string,
    ): Promise<string[]> {
        if (nodes.length === 0) return [];
        const document = await this.getDocument(fileKey);
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
        fileKey: string,
        nodes: FetchImageParams[],
        localPath: string,
        pngScale: number,
        svgOptions: {
            outlineText: boolean;
            includeId: boolean;
            simplifyStroke: boolean;
        },
    ): Promise<string[]> {
        const document = await this.getDocument(fileKey);


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
    async getFile(fileKey: string, depth?: number | null): Promise<Document> {
        try {
            const document = await this.getDocument(fileKey);
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
    async getNode(fileKey: string, pageId: string, nodeId: string, depth?: number | null): Promise<Shape> {
        const document = await this.getDocument(fileKey);
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

    async getPageInfos(fileKey: string): Promise<{ id: string, name: string, nodeCount: number }[]> {
        const document = await this.getDocument(fileKey);
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

    // 获取节点填充图片作为blob数据
    async getImageFillsAsBlob(
        fileKey: string,
        nodes: FetchImageFillParams[],
    ): Promise<{ fileName: string; data: Uint8Array; mimeType: string }[]> {
        if (nodes.length === 0) return [];
        const document = await this.getDocument(fileKey);
        const data = document.data();
        const mediaMgr = data.mediasMgr;

        const promises = nodes.map(async ({ imageRef, fileName }) => {
            const image = await mediaMgr.get(imageRef);
            if (!image) {
                return null;
            }
            // 根据文件扩展名确定MIME类型
            const ext = path.extname(fileName).toLowerCase();
            let mimeType = 'application/octet-stream';
            if (ext === '.png') mimeType = 'image/png';
            else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
            else if (ext === '.svg') mimeType = 'image/svg+xml';
            else if (ext === '.webp') mimeType = 'image/webp';

            return {
                fileName,
                data: image.buff,
                mimeType,
            };
        });

        const results = await Promise.all(promises);
        return results.filter(result => result !== null) as { fileName: string; data: Uint8Array; mimeType: string }[];
    }

    // 将节点绘制成图片并返回blob数据
    async getImagesAsBlob(
        fileKey: string,
        nodes: FetchImageParams[],
        pngScale: number,
        svgOptions: {
            outlineText: boolean;
            includeId: boolean;
            simplifyStroke: boolean;
        },
    ): Promise<{ fileName: string; data: Uint8Array; mimeType: string }[]> {
        const document = await this.getDocument(fileKey);
        const result: { fileName: string; data: Uint8Array; mimeType: string }[] = [];

        // 获取所有节点
        const tasks = nodes.map(async (node) => {
            const view = await document.getNodeView(node.nodeId, node.pageId);
            if (!view) return null;

            if (node.fileType === 'png') {
                const tempCanvas = await IO.exportImg(view, pngScale) as Canvas | undefined;
                if (!tempCanvas) return null;
                // 使用 skia-canvas 的 png 属性生成 PNG
                const buffer = await tempCanvas.png;
                return {
                    fileName: node.fileName,
                    data: buffer,
                    mimeType: 'image/png',
                };
            } else if (node.fileType === 'svg') {
                const svg = await IO.exportSvg(view);
                return {
                    fileName: node.fileName,
                    data: Buffer.from(svg),
                    mimeType: 'image/svg+xml',
                };
            }
            return null;
        });

        const results = await Promise.all(tasks);
        return results.filter(result => result !== null) as { fileName: string; data: Uint8Array; mimeType: string }[];
    }
}
