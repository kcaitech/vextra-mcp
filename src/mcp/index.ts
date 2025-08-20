import { VextraDataService } from "@/data/vextra";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as get_vextra_data from "./get_vextra_data";
import * as get_vextra_images_blob from "./get_vextra_images_blob";
import * as get_vextra_images from "./get_vextra_images";
import * as get_vextra_pagesinfo from "./get_vextra_pagesinfo";

function registerTools(
    server: McpServer,
    vextraService: VextraDataService,
    outputFormat: "yaml" | "json",
    sessionId: string,
    host: string,
): void {

    // get_vextra_data 
    get_vextra_data.registTools(server, vextraService, outputFormat, sessionId, host);

    get_vextra_images_blob.registTools(server, vextraService, outputFormat, sessionId, host);

    // get_vextra_pagesinfo
    get_vextra_pagesinfo.registTools(server, vextraService, outputFormat, sessionId, host);
}

const serverInfo = {
    name: "Vextra MCP Server",
    version: process.env.NPM_PACKAGE_VERSION ?? "unknown",
};

type CreateServerOptions = {
    outputFormat: "yaml" | "json";
    host: string;
};

export function createServer(
    vextraOAuthToken: () => Promise<string>,
    sessionId: string,
    { outputFormat, host }: CreateServerOptions,
) {
    const server = new McpServer(serverInfo);
    const vextraService = new VextraDataService(vextraOAuthToken);
    registerTools(server, vextraService, outputFormat, sessionId, host);

    return {mcpServer: server, vextraService: vextraService};
}