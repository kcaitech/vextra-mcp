import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { VextraService } from "@/vextra";
import { Document } from "./simplify/document";
import yaml from "js-yaml";
import { Logger } from "@/utils/logger";
import { Shape } from "./simplify/types";

const serverInfo = {
  name: "Vextra MCP Server",
  version: process.env.NPM_PACKAGE_VERSION ?? "unknown",
};

type CreateServerOptions = {
  isHTTP?: boolean;
  outputFormat?: "yaml" | "json";
};

function createServer(
  vextraOAuthToken: string,
  { isHTTP = false, outputFormat = "yaml" }: CreateServerOptions = {},
) {
  const server = new McpServer(serverInfo);
  const vextraService = new VextraService(vextraOAuthToken);
  registerTools(server, vextraService, outputFormat);

  Logger.isHTTP = isHTTP;

  return server;
}

function registerTools(
  server: McpServer,
  vextraService: VextraService,
  outputFormat: "yaml" | "json",
): void {
  // Tool to get file information
  server.tool(
    "get_vextra_data",
    "When the nodeId cannot be obtained, obtain the layout information about the entire Vextra file",
    {
      fileKey: z
        .string()
        .describe(
          `The key of the Vextra file to fetch, often found in a provided URL like vextra.(cn|io)/document/<fileKey>/...
          Or the file path of the local file, witch the extension is .vext. Local file path is start with file://...`,
        ),
      pageId: z
        .string()
        .optional()
        .describe(
          "The ID of the page to fetch, often found in a provided URL like vextra.(cn|io)/document/<fileKey>/<pageId>/...",
        ),
      nodeId: z
        .string()
        .optional()
        .describe(
          "The ID of the node to fetch, often found in a provided URL like vextra.(cn|io)/document/<fileKey>/<pageId>/<nodeId>/...",
        ),
      depth: z
        .number()
        .optional()
        .describe(
          "OPTIONAL. Do NOT use unless explicitly requested by the user. Controls how many levels deep to traverse the node tree,",
        ),
    },
    async ({ fileKey, pageId, nodeId, depth }) => {
      try {
        Logger.log(
          `Fetching ${depth ? `${depth} layers deep` : "all layers"
          } of ${nodeId ? `node ${nodeId} from file` : `full file`} ${fileKey}`,
        );

        let result: Document | Shape;
        if (pageId && nodeId) {
          result = await vextraService.getNode(fileKey, pageId, nodeId, depth);
        } else if (pageId) {
          result = await vextraService.getNode(fileKey, pageId, pageId, depth);
        } else {
          result = await vextraService.getFile(fileKey, depth);
        }

        // Logger.log(`Successfully fetched file: ${file.name}`);

        Logger.log(`Generating ${outputFormat.toUpperCase()} result from file`);
        const formattedResult =
          outputFormat === "json" ? JSON.stringify(result, null, 2) : yaml.dump(result);

        Logger.log("Sending result to client", formattedResult);
        return {
          content: [{ type: "text", text: formattedResult }],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : JSON.stringify(error);
        Logger.error(`Error fetching file ${fileKey}:`, message);
        return {
          isError: true,
          content: [{ type: "text", text: `Error fetching file: ${message}` }],
        };
      }
    },
  );

  // TODO: Clean up all image download related code, particularly getImages in Vextra service
  // Tool to download images
  server.tool(
    "download_vextra_images",
    "Download SVG and PNG images used in a Vextra file based on the IDs of image or icon nodes",
    {
      fileKey: z.string().describe(
        `The key of the Vextra file to fetch, often found in a provided URL like vextra.(cn|io)/document/<fileKey>/...
        Or the file path of the local file, witch the extension is .vext. Local file path is start with file://...`
      ),
      nodes: z
        .object({
          pageId: z
            .string()
            .describe("The ID of the Vextra page to fetch, formatted as a UUID"),
          nodeId: z
            .string()
            .describe("The ID of the Vextra image node to fetch, formatted as a UUID"),
          imageRef: z
            .string()
            .optional()
            .describe(
              "If a node has an imageRef fill, you must include this variable. Leave blank when downloading Vector SVG images.",
            ),
          fileName: z.string().describe("The local name for saving the fetched file"),
        })
        .array()
        .describe("The nodes to fetch as images"),
      pngScale: z
        .number()
        .positive()
        .optional()
        .default(2)
        .describe(
          "Export scale for PNG images. Optional, defaults to 2 if not specified. Affects PNG images only.",
        ),
      localPath: z
        .string()
        .describe(
          "The absolute path to the directory where images are stored in the project. If the directory does not exist, it will be created. The format of this path should respect the directory format of the operating system you are running on. Don't use any special character escaping in the path name either.",
        ),
      svgOptions: z
        .object({
          outlineText: z
            .boolean()
            .optional()
            .default(true)
            .describe("Whether to outline text in SVG exports. Default is true."),
          includeId: z
            .boolean()
            .optional()
            .default(false)
            .describe("Whether to include IDs in SVG exports. Default is false."),
          simplifyStroke: z
            .boolean()
            .optional()
            .default(true)
            .describe("Whether to simplify strokes in SVG exports. Default is true."),
        })
        .optional()
        .default({})
        .describe("Options for SVG export"),
    },
    async ({ fileKey, nodes, localPath, svgOptions, pngScale }) => {
      try {
        const imageFills = nodes.filter(({ imageRef }) => !!imageRef) as {
          nodeId: string;
          imageRef: string;
          fileName: string;
        }[];
        const fillDownloads = vextraService.getImageFills(fileKey, imageFills, localPath);
        const renderRequests = nodes
          .filter(({ imageRef }) => !imageRef)
          .map(({ pageId, nodeId, fileName }) => ({
            pageId,
            nodeId,
            fileName,
            fileType: fileName.endsWith(".svg") ? ("svg" as const) : ("png" as const),
          }));

        const renderDownloads = vextraService.getImages(
          fileKey,
          renderRequests,
          localPath,
          pngScale,
          svgOptions,
        );

        const downloads = await Promise.all([fillDownloads, renderDownloads]).then(([f, r]) => [
          ...f,
          ...r,
        ]);

        // If any download fails, return false
        const saveSuccess = !downloads.find((success) => !success);
        return {
          content: [
            {
              type: "text",
              text: saveSuccess
                ? `Success, ${downloads.length} images downloaded: ${downloads.join(", ")}`
                : "Failed",
            },
          ],
        };
      } catch (error) {
        Logger.error(`Error downloading images from file ${fileKey}:`, error);
        return {
          isError: true,
          content: [{ type: "text", text: `Error downloading images: ${error}` }],
        };
      }
    },
  );
}

export { createServer };
