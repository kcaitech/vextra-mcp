import fs from "fs";
import { serializeDocument, Document, serializeNode } from "./simplify/document";
import { Logger } from "@/utils/logger";
import yaml from "js-yaml";
import { IDocument } from "./document";
import { DocumentRemote } from "./document_remote";
import { Shape } from "./simplify/types";
import { DocumentLocal } from "./document_local";
import path from "path";
import { Canvas } from "skia-canvas";

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

export class VextraService {
  private documentMap = new Map<string, IDocument>();
  private readonly oauthToken: string;

  constructor(vextraOAuthToken: string) {
    this.oauthToken = vextraOAuthToken || "";
  }

  async getDocument(fileKey: string): Promise<IDocument> {
    if (this.documentMap.has(fileKey)) {
      return this.documentMap.get(fileKey)!;
    }
    let document: IDocument;
    if (fileKey.startsWith("file://")) {
      fileKey = fileKey.replace("file://", "/");
      // 去除fileKey前面多余的/，只保留一个/
      fileKey = fileKey.replace(/^\/+/, "/");
      document = new DocumentLocal(fileKey);
    } else {
      document = new DocumentRemote(this.oauthToken, fileKey);
    }
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
        // 使用 skia-canvas 库创建 canvas
        const frame = view.frame;
        console.log("size", frame, pngScale);
        let width = frame.width * pngScale;
        let height = frame.height * pngScale;

        if (width <= 0 || height <= 0) return;
        const max_size = 4096
        if (width > max_size || height > max_size) {
          // 等比缩小到4k大小
          const scale = Math.min(max_size / width, max_size / height);
          width = Math.floor(width * scale);
          height = Math.floor(height * scale);
          pngScale = pngScale * scale;
        }

        const tempCanvas = new Canvas(width, height);
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.translate(-frame.x, -frame.y);
        tempCtx.scale(pngScale, pngScale);
        view.ctx.setCanvas(tempCtx as any);

        view.render('Canvas'); // render to png
        // 使用 skia-canvas 的 png 属性生成 PNG
        const buffer = await tempCanvas.png;

        // 保存为PNG文件
        const path = saveFile(node.fileName, localPath, buffer);
        result.set(node.nodeId, path);
      }
      else if (node.fileType === 'svg') {

        const svg = view.toSVGString();
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
}
