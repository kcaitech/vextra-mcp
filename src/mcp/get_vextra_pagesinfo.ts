import { VextraDataService } from "@/data/vextra";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import z from "zod";
import yaml from "js-yaml";

const toolName = "Get Vextra Pages Info";

function getDescription(host: string) {
    const description = `
Retrieve page metadata from ${host}'s URL, like ${host}/document/... . It supports Vextra/Figma/Sketch/SVG files.

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
    return description
}

type ArgsSchema = z.ZodObject<{
    fileId: z.ZodString;
}>

function getArgsSchema(host: string) {

    const argsSchema = z.object({
        fileId: z
            .string()
            .describe(
                `The ID of the Vextra file to fetch, often found in a provided URL like ${host}/document/<fileId>/...`,
            ),
    })
    return argsSchema
}


const func = async ({ fileId }: z.infer<ArgsSchema>, vextraService: VextraDataService, outputFormat: "yaml" | "json", sessionId: string) => {
    try {
        console.log(
            `Fetching pages info of ${fileId} for session: ${sessionId}`,
        );

        let result: { id: string, name: string, nodeCount: number }[];

        result = await vextraService.getPageInfos(fileId);

        const formattedResult =
            outputFormat === "json" ? JSON.stringify(result, null, 2) : yaml.dump(result);

        return {
            content: [{ type: "text" as const, text: formattedResult }],
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : JSON.stringify(error);
        console.error(`Error fetching file ${fileId}:`, error);
        return {
            isError: true,
            content: [{ type: "text" as const, text: `Error fetching file: ${message}` }],
        };
    }
}

export function registTools(server: McpServer, vextraService: VextraDataService, outputFormat: "yaml" | "json", sessionId: string, host: string) {
    server.tool(toolName, getDescription(host), getArgsSchema(host).shape, (args: z.infer<ArgsSchema>) =>
        func(args, vextraService, outputFormat, sessionId)
    );
}