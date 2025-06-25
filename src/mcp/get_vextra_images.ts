
import { VextraService } from "@/data/vextra";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import yaml from "js-yaml";

const toolName = "get_vextra_images";

const description = `
Retrieve images from Vextra/Figma/Sketch/Moss files or render document nodes as images.

**Primary Functions:**
1. **Extract embedded images**: Get all images used within the design file
2. **Render nodes to images**: Convert specific document nodes/components into image format
3. **Visual verification**: Generate images to verify that code implementation matches design expectations

**Common Use Cases:**
- Asset extraction: Pull out all images, icons, and graphics from a design file
- Component visualization: Render complex UI components as images when code generation isn't needed
- Design-to-code validation: Compare generated code output with original design by rendering both as images
- Documentation: Create visual references for design components and layouts
`

const argsSchema = z.object({
    fileKey: z.string().describe(
        `The key of the Vextra file to fetch, often found in a provided URL like vextra.(cn|io)/document/<fileKey>/...
      Or the file path of the local file, witch support extension is (.vext, .sketch, .fig, .moss). Local file path use file schema, like file://file/path/to/file.vext...`,
    ),
    nodes: z
        .object({
            pageId: z
                .string()
                .describe("The ID of the Vextra page to fetch, formatted as a UUID"),
            nodeId: z
                .string()
                .describe("The ID of the Vextra image node to fetch, formatted as a UUID"),
            imageRef: z
                .string()
                .optional()
                .describe(
                    "If a node has an imageRef fill, you must include this variable. Leave blank when downloading Vector SVG images.",
                ),
            fileName: z.string().describe("The local name for saving the fetched file"),
        })
        .array()
        .describe("The nodes to fetch as images"),
    pngScale: z
        .number()
        .positive()
        .optional()
        .default(2)
        .describe(
            "Export scale for PNG images. Optional, defaults to 2 if not specified. Affects PNG images only.",
        ),
    localPath: z
        .string()
        .describe(
            "The absolute path to the directory where images are stored in the project. If the directory does not exist, it will be created. The format of this path should respect the directory format of the operating system you are running on. Don't use any special character escaping in the path name either.",
        ),
    svgOptions: z
        .object({
            outlineText: z
                .boolean()
                .optional()
                .default(true)
                .describe("Whether to outline text in SVG exports. Default is true."),
            includeId: z
                .boolean()
                .optional()
                .default(false)
                .describe("Whether to include IDs in SVG exports. Default is false."),
            simplifyStroke: z
                .boolean()
                .optional()
                .default(true)
                .describe("Whether to simplify strokes in SVG exports. Default is true."),
        })
        .optional()
        .default({})
        .describe("Options for SVG export"),
})

const func = async ({ fileKey, nodes, localPath, svgOptions, pngScale }: z.infer<typeof argsSchema>, vextraService: VextraService, outputFormat: "yaml" | "json") => {
    try {
        const imageFills = nodes.filter(({ imageRef }) => !!imageRef) as {
            nodeId: string;
            imageRef: string;
            fileName: string;
        }[];
        const fillDownloads = vextraService.getImageFills(fileKey, imageFills, localPath);
        const renderRequests = nodes
            .filter(({ imageRef }) => !imageRef)
            .map(({ pageId, nodeId, fileName }) => ({
                pageId,
                nodeId,
                fileName,
                fileType: fileName.endsWith(".svg") ? ("svg" as const) : ("png" as const),
            }));

        const renderDownloads = vextraService.getImages(
            fileKey,
            renderRequests,
            localPath,
            pngScale,
            svgOptions,
        );

        const downloads = await Promise.all([fillDownloads, renderDownloads]).then(([f, r]) => [
            ...f,
            ...r,
        ]);

        const result = {
            success_images: downloads.filter((success) => !!success),
            failed_images: downloads.filter((success) => !success),
        }
        console.log("Sending result to client");
        const formattedResult =
            outputFormat === "json" ? JSON.stringify(result, null, 2) : yaml.dump(result);
        return {
            content: [
                {
                    type: "text" as const,
                    text: formattedResult
                },
            ],
        };
    } catch (error) {
        console.error(`Error downloading images from file ${fileKey}:`, error);
        return {
            isError: true,
            content: [{ type: "text" as const, text: `Error downloading images: ${error}` }],
        };
    }
}


export function registTools(server: McpServer, vextraService: VextraService, outputFormat: "yaml" | "json") {
    server.tool(toolName, description, argsSchema.shape, (args: z.infer<typeof argsSchema>) =>
        func(args, vextraService, outputFormat)
    );
}