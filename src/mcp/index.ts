import { VextraService } from "@/data/vextra";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as get_vextra_data from "./get_vextra_data";
import * as get_vextra_images from "./get_vextra_images";
import * as get_vextra_pagesinfo from "./get_vextra_pagesinfo";
import { Logger } from "@/utils/logger";

function registerTools(
    server: McpServer,
    vextraService: VextraService,
    outputFormat: "yaml" | "json",
  ): void {

    // get_vextra_data 
    get_vextra_data.registTools(server, vextraService, outputFormat);

    // get_vextra_images
    get_vextra_images.registTools(server, vextraService);

    // get_vextra_pagesinfo
    get_vextra_pagesinfo.registTools(server, vextraService, outputFormat);
  }

  const serverInfo = {
    name: "Vextra MCP Server",
    version: process.env.NPM_PACKAGE_VERSION ?? "unknown",
  };
  
  type CreateServerOptions = {
    isHTTP?: boolean;
    outputFormat?: "yaml" | "json";
  };
  
  export function createServer(
    vextraOAuthToken: string,
    { isHTTP = false, outputFormat = "yaml" }: CreateServerOptions = {},
  ) {
    const server = new McpServer(serverInfo);
    const vextraService = new VextraService(vextraOAuthToken);
    registerTools(server, vextraService, outputFormat);
  
    Logger.isHTTP = isHTTP;
  
    return server;
  }