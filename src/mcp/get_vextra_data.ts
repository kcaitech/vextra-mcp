import { SimpleVext } from "@kcdesign/data";
import z from "zod"
import { VextraDataService } from "@/data/vextra";
import yaml from "js-yaml";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

type Document = SimpleVext.Document;
type Shape = SimpleVext.Shape;
const toolName = "Get Vextra Data";

function getDescription(host: string) {
    const description = `
Retrieve layout information from ${host}'s URL, like ${host}/document/... . It supports Vextra/Figma/Sketch/SVG files.

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
    return description
}

type ArgsSchema = z.ZodObject<{
    fileId: z.ZodString;
    pageId: z.ZodOptional<z.ZodString>;
    nodeId: z.ZodOptional<z.ZodString>;
    depth: z.ZodOptional<z.ZodNumber>;
}>

function getArgsSchema(host: string) {
    const argsSchema = z.object({
        fileId: z
            .string()
            .describe(
                `The ID of the Vextra file to fetch, often found in a provided URL like ${host}/document/<fileId>/...`,
            ),
        pageId: z
            .string()
            .optional()
            .describe(
                `The ID of the page to fetch, often found in a provided URL like ${host}/document/<fileId>/<pageId>/...`,
            ),
        nodeId: z
            .string()
            .optional()
            .describe(
                `The ID of the node to fetch, often found in a provided URL like ${host}/document/<fileId>/<pageId>/<nodeId>/...`,
            ),
        depth: z
            .number()
            .optional()
            .describe(
                "OPTIONAL. Controls how many levels deep to traverse the node tree,",
            ),
    })
    return argsSchema
}

const func = async ({ fileId, pageId, nodeId, depth }: z.infer<ArgsSchema>, vextraService: VextraDataService, outputFormat: "yaml" | "json", sessionId: string) => {
    try {
        console.log(`Fetching data of ${fileId}/${pageId}/${nodeId}, depth: ${depth} for session: ${sessionId}`);

        let result: Document | Shape;
        if (pageId && nodeId) {
            result = await vextraService.getNode(fileId, pageId, nodeId, depth);
        } else if (pageId) {
            result = await vextraService.getNode(fileId, pageId, pageId, depth);
        } else {
            result = await vextraService.getFile(fileId, depth);
        }

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