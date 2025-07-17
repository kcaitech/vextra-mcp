/*
 * Copyright (c) 2023-2025 KCai Technology (https://kcaitech.com). All rights reserved.
 *
 * This file is part of the Vextra project, which is licensed under the AGPL-3.0 license.
 * The full license text can be found in the LICENSE file in the root directory of this source tree.
 *
 * For more information about the AGPL-3.0 license, please visit:
 * https://www.gnu.org/licenses/agpl-3.0.html
 */

import { VextraDataService } from "@/data/vextra";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import z from "zod";
import yaml from "js-yaml";

const toolName = "Get Vextra Pages Info";

const description = `
Retrieve page metadata from Vextra/Figma/Sketch/SVG files to understand file structure before detailed data extraction.

**Retrieved Information:**
- **Page ID**: Unique identifier for each page (required for targeted data retrieval)
- **Page Name**: Human-readable page titles and labels
- **Node Count**: Number of design elements/components on each page

**Key Benefits:**
- **Strategic planning**: Understand file complexity before using get_vextra_data
- **Performance optimization**: Identify pages with high node counts that may require depth limiting
- **Navigation aid**: Get page structure overview for efficient data extraction

**Best Practice:**
Always use this tool first for large or unfamiliar files. When node count is high (>1000), consider using the depth parameter in get_vextra_data to prevent context overflow and ensure successful data retrieval.
`

const argsSchema = z.object({
    filePath: z
        .string()
        .describe(
            `The file path of the local file, witch support extension is (.vext, .sketch, .fig, .svg). Local file path use file schema, like /file/path/to/file.vext...`,
        ),
})

const func = async ({ filePath}: z.infer<typeof argsSchema>, vextraService: VextraDataService, outputFormat: "yaml" | "json") => {
    try {
        console.log(
            `Fetching pages info of ${filePath}`,
        );

        let result: {id: string, name: string, nodeCount: number}[];

        result = await vextraService.getPageInfos(filePath);

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