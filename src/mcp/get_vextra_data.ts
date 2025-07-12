import { Shape } from "@/data/simplify/types";
import { Document } from "@/data/simplify/document";
import z from "zod"
import { VextraService } from "@/data/vextra";
import yaml from "js-yaml";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

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
    fileKey: z
        .string()
        .describe(
            `The key of the Vextra file to fetch, often found in a provided URL like vextra.(cn|io)/document/<fileKey>/...
        Or the file path of the local file, witch support extension is (.vext, .sketch, .fig, .svg). Local file path use file schema, like file://file/path/to/file.vext...`,
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
})

const func = async ({ fileKey, pageId, nodeId, depth }: z.infer<typeof argsSchema>, vextraService: VextraService, outputFormat: "yaml" | "json") => {
    try {
        console.log(
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

        console.log(`Generating ${outputFormat.toUpperCase()} result from file`);
        const formattedResult =
            outputFormat === "json" ? JSON.stringify(result, null, 2) : yaml.dump(result);

        console.log("Sending result to client");
        return {
            content: [{ type: "text" as const, text: formattedResult }],
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : JSON.stringify(error);
        console.error(`Error fetching file ${fileKey}:`, message);
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