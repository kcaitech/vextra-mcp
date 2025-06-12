import fs from "fs";
import { parseFigmaResponse, SimplifiedDesign } from "@/transform/simplify-node-response";
import { downloadFile, saveFile } from "@/utils/fetch-with-retry";
import { Logger } from "@/utils/logger";
import yaml from "js-yaml";
import { IDocument } from "./data/document";
import { DocumentRemote } from "./data/document_remote";

type FetchImageParams = {
  /**
   * The Node in Figma that will either be rendered or have its background image downloaded
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

type FetchImageFillParams = Omit<FetchImageParams, "fileType"> & {
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
    const document = new DocumentRemote(this.oauthToken, fileKey);
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
    const data = document.data();

    // 获取所有节点


    const pngIds = nodes.filter(({ fileType }) => fileType === "png").map(({ nodeId }) => nodeId);
    const pngFiles =
      pngIds.length > 0
        ? this.request<GetImagesResponse>(
            `/images/${fileKey}?ids=${pngIds.join(",")}&format=png&scale=${pngScale}`,
          ).then(({ images = {} }) => images)
        : ({} as GetImagesResponse["images"]);

    const svgIds = nodes.filter(({ fileType }) => fileType === "svg").map(({ nodeId }) => nodeId);
    const svgParams = [
      `ids=${svgIds.join(",")}`,
      "format=svg",
      `svg_outline_text=${svgOptions.outlineText}`,
      `svg_include_id=${svgOptions.includeId}`,
      `svg_simplify_stroke=${svgOptions.simplifyStroke}`,
    ].join("&");

    const svgFiles =
      svgIds.length > 0
        ? this.request<GetImagesResponse>(`/images/${fileKey}?${svgParams}`).then(
            ({ images = {} }) => images,
          )
        : ({} as GetImagesResponse["images"]);

    const files = await Promise.all([pngFiles, svgFiles]).then(([f, l]) => ({ ...f, ...l }));

    const downloads = nodes
      .map(({ nodeId, fileName }) => {
        const imageUrl = files[nodeId];
        if (imageUrl) {
          return downloadFile(fileName, localPath, imageUrl);
        }
        return false;
      })
      .filter((url) => !!url);

    return Promise.all(downloads);
  }

  // 获取整个文件
  async getFile(fileKey: string, depth?: number | null): Promise<SimplifiedDesign> {
    try {
      const endpoint = `/files/${fileKey}${depth ? `?depth=${depth}` : ""}`;
      Logger.log(`Retrieving Figma file: ${fileKey} (depth: ${depth ?? "default"})`);
      const response = await this.request<GetFileResponse>(endpoint);
      Logger.log("Got response");
      const simplifiedResponse = parseFigmaResponse(response);
      writeLogs("figma-raw.yml", response);
      writeLogs("figma-simplified.yml", simplifiedResponse);
      return simplifiedResponse;
    } catch (e) {
      console.error("Failed to get file:", e);
      throw e;
    }
  }

  // 获取单个节点
  async getNode(fileKey: string, nodeId: string, depth?: number | null): Promise<SimplifiedDesign> {
    const endpoint = `/files/${fileKey}/nodes?ids=${nodeId}${depth ? `&depth=${depth}` : ""}`;
    const response = await this.request<GetFileNodesResponse>(endpoint);
    Logger.log("Got response from getNode, now parsing.");
    writeLogs("figma-raw.yml", response);
    const simplifiedResponse = parseFigmaResponse(response);
    writeLogs("figma-simplified.yml", simplifiedResponse);
    return simplifiedResponse;
  }
}

function writeLogs(name: string, value: any) {
  try {
    if (process.env.NODE_ENV !== "development") return;

    const logsDir = "logs";

    try {
      fs.accessSync(process.cwd(), fs.constants.W_OK);
    } catch (error) {
      Logger.log("Failed to write logs:", error);
      return;
    }

    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir);
    }
    fs.writeFileSync(`${logsDir}/${name}`, yaml.dump(value));
  } catch (error) {
    console.debug("Failed to write logs:", error);
  }
}
