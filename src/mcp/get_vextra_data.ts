import { Shape } from "@/data/simplify/types";
import { Document } from "@/data/simplify/document";
import { Logger } from "@/utils/logger";
import z from "zod"
import { VextraService } from "@/data/vextra";
import yaml from "js-yaml";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const toolName = "get_vextra_data";

const description = `
Obtain the layout information about the entire Vextra/Figma/Sketch/Moss file.
Note that when the file size is large, the retrieved document content may be too much and exceed the model's context length, causing the model to fail to process it.
In this case, you can consider retrieving shallower level object data by passing the depth parameter to control the depth of the retrieved levels.
`

const argsSchema = z.object({
    fileKey: z
        .string()
        .describe(
            `The key of the Vextra file to fetch, often found in a provided URL like vextra.(cn|io)/document/<fileKey>/...
        Or the file path of the local file, witch support extension is (.vext, .sketch, .fig, .moss). Local file path use file schema, like file://file/path/to/file.vext...`,
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