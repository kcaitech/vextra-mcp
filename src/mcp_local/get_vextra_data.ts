/*
 * Copyright (c) 2023-2025 KCai Technology (https://kcaitech.com). All rights reserved.
 *
 * This file is part of the Vextra project, which is licensed under the AGPL-3.0 license.
 * The full license text can be found in the LICENSE file in the root directory of this source tree.
 *
 * For more information about the AGPL-3.0 license, please visit:
 * https://www.gnu.org/licenses/agpl-3.0.html
 */

import { SimpleVext } from "@kcaitech/vextra-core";
import z from "zod"
import { VextraDataService } from "@/data/vextra_local";
import yaml from "js-yaml";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

type Document = SimpleVext.Document;
type Shape = SimpleVext.Shape;

const toolName = "Get Vextra Data";

const description = `
Retrieve layout information from Vextra/Figma/Sketch/SVG files.

IMPORTANT: For large files, the retrieved content may exceed the model's context length. 
Use these strategies to manage large documents:

1. **Use depth parameter**: Control traversal depth to get shallower data first
2. **Check pages first**: Use get_vextra_pagesinfo tool to understand file structure
3. **Progressive refinement**: For large documents, use a pruning approach:
   - First, get nodes at depth=3 for a specific page (#pageId)
   - Identify nodes of interest from the results
   - Then fetch deeper data for specific nodes (#pageId#nodeId) at depth=3
   - Repeat as needed to drill down further

This progressive approach prevents context overflow while allowing detailed exploration of specific areas.
`

const argsSchema = z.object({
    filePath: z
        .string()
        .describe(
            `The file path of the local file, witch support extension is (.vext, .sketch, .fig, .svg). Local file path use file schema, like /file/path/to/file.vext...`,
        ),
    pageId: z
        .string()
        .optional()
        .describe(
            "The ID of the page to fetch, often found in a provided URL like vextra.(cn|io)/document/<filePath>/<pageId>/...",
        ),
    nodeId: z
        .string()
        .optional()
        .describe(
            "The ID of the node to fetch, often found in a provided URL like vextra.(cn|io)/document/<filePath>/<pageId>/<nodeId>/...",
        ),
    depth: z
        .number()
        .optional()
        .describe(
            "OPTIONAL. Do NOT use unless explicitly requested by the user. Controls how many levels deep to traverse the node tree,",
        ),
})

const func = async ({ filePath, pageId, nodeId, depth }: z.infer<typeof argsSchema>, vextraService: VextraDataService, outputFormat: "yaml" | "json") => {
    try {
        console.log(
            `Fetching ${depth ? `${depth} layers deep` : "all layers"
            } of ${nodeId ? `node ${nodeId} from file` : `full file`} ${filePath}`,
        );

        let result: Document | Shape;
        if (pageId && nodeId) {
            result = await vextraService.getNode(filePath, pageId, nodeId, depth);
        } else if (pageId) {
            result = await vextraService.getNode(filePath, pageId, pageId, depth);
        } else {
            result = await vextraService.getFile(filePath, depth);
        }

        console.log(`Generating ${outputFormat.toUpperCase()} result from file`);
        const formattedResult =
            outputFormat === "json" ? JSON.stringify(result, null, 2) : yaml.dump(result);

        console.log("Sending result to client");
        return {
            content: [{ type: "text" as const, text: formattedResult }],
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : JSON.stringify(error);
        console.error(`Error fetching file ${filePath}:`, message);
        return {
            isError: true,
            content: [{ type: "text" as const, text: `Error fetching file: ${message}` }],
        };
    }
}

export function registTools(server: McpServer, vextraService: VextraDataService, outputFormat: "yaml" | "json") {
    server.tool(toolName, description, argsSchema.shape, (args: z.infer<typeof argsSchema>) =>
        func(args, vextraService, outputFormat)
    );
}