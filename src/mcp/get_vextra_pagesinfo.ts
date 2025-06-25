import { VextraService } from "@/data/vextra";
import { Logger } from "@/utils/logger";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import z from "zod";
import yaml from "js-yaml";

const toolName = "get_vextra_pagesinfo";

const description = `
Retrieve page metadata from Vextra/Figma/Sketch/Moss files to understand file structure before detailed data extraction.

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
    fileKey: z
        .string()
        .describe(
            `The key of the Vextra file to fetch, often found in a provided URL like vextra.(cn|io)/document/<fileKey>/...
        Or the file path of the local file, witch support extension is (.vext, .sketch, .fig, .moss). Local file path use file schema, like file://file/path/to/file.vext...`,
        ),
})

const func = async ({ fileKey}: z.infer<typeof argsSchema>, vextraService: VextraService, outputFormat: "yaml" | "json") => {
    try {
        Logger.log(
            `Fetching pages info of ${fileKey}`,
        );

        let result: {id: string, name: string, nodeCount: number}[];

        result = await vextraService.getPageInfos(fileKey);

        Logger.log(`Generating ${outputFormat.toUpperCase()} result from file`);
        const formattedResult =
            outputFormat === "json" ? JSON.stringify(result, null, 2) : yaml.dump(result);

        Logger.log("Sending result to client");
        return {
            content: [{ type: "text" as const, text: formattedResult }],
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : JSON.stringify(error);
        Logger.error(`Error fetching file ${fileKey}:`, message);
        return {
            isError: true,
            content: [{ type: "text" as const, text: `Error fetching file: ${message}` }],
        };
    }
}

export function registTools(server: McpServer, vextraService: VextraService, outputFormat: "yaml" | "json") {
    server.tool(toolName, description, argsSchema.shape, (args: z.infer<typeof argsSchema>) =>
        func(args, vextraService, outputFormat)
    );
}