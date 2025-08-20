/*
 * Copyright (c) 2023-2025 KCai Technology (https://kcaitech.com). All rights reserved.
 *
 * This file is part of the Vextra project, which is licensed under the AGPL-3.0 license.
 * The full license text can be found in the LICENSE file in the root directory of this source tree.
 *
 * For more information about the AGPL-3.0 license, please visit:
 * https://www.gnu.org/licenses/agpl-3.0.html
 */

import { VextraDataService } from "@/data/vextra_local";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as get_vextra_data from "./get_vextra_data";
import * as get_vextra_images from "./get_vextra_images";
import * as get_vextra_pagesinfo from "./get_vextra_pagesinfo";

function registerTools(
    server: McpServer,
    vextraService: VextraDataService,
    outputFormat: "yaml" | "json",
  ): void {

    // get_vextra_data 
    get_vextra_data.registTools(server, vextraService, outputFormat);

    // get_vextra_images
    get_vextra_images.registTools(server, vextraService, outputFormat);

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
    { outputFormat = "yaml" }: CreateServerOptions = {},
  ) {
    const server = new McpServer(serverInfo);
    const vextraService = new VextraDataService();
    registerTools(server, vextraService, outputFormat);
  
    return server;
  }