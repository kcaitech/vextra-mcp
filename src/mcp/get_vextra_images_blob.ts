import { VextraDataService } from "@/data/vextra";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import yaml from "js-yaml";
import { getStorage } from "@/services/storage";
import { fileCleanupService } from "@/services/file-cleanup";
import { getStoragePublicUrl } from "@/config";

const toolName = "Get Vextra Images";

function getDescription(host: string) {

    const description = `
Retrieve images from ${host}'s URL, like ${host}/document/... . It supports Vextra/Figma/Sketch/SVG files.

**Primary Functions:**
1. **Extract embedded images**: Get all images used within the design file
2. **Render nodes to images**: Convert specific document nodes/components into image format
3. **Visual verification**: Generate images to verify that code implementation matches design expectations

**Common Use Cases:**
- Asset extraction: Pull out all images, icons, and graphics from a design file
- Component visualization: Render complex UI components as images when code generation isn't needed
- Design-to-code validation: Compare generated code output with original design by rendering both as images
- Documentation: Create visual references for design components and layouts

**Return Format:**
Returns OSS links for images, each containing:
- fileName: File name
- mimeType: MIME type (e.g., image/png, image/svg+xml, etc.)
- url: OSS access link with 1-hour validity
- size: File size in bytes
`
    return description
}

type ArgsSchema = z.ZodObject<{
    fileId: z.ZodString;
    nodes: z.ZodArray<z.ZodObject<{
        pageId: z.ZodString;
        nodeId: z.ZodString;
        imageRef: z.ZodOptional<z.ZodString>;
        fileName: z.ZodString;
    }>>;
    pngScale: z.ZodNumber;
    svgOptions: z.ZodObject<{
        outlineText: z.ZodBoolean;
        includeId: z.ZodBoolean;
        simplifyStroke: z.ZodBoolean;
    }>;
}>

function getArgsSchema(host: string) {

    const argsSchema = z.object({
        fileId: z.string().describe(
            `The ID of the Vextra file to fetch, often found in a provided URL like vextra.(cn|io)/document/<fileId>/...`,
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
                fileName: z.string().describe("The name of the image file"),
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
    return argsSchema
}

const func = async ({ fileId, nodes, svgOptions, pngScale }: z.infer<ArgsSchema>, vextraService: VextraDataService, outputFormat: "yaml" | "json", sessionId: string) => {
    try {
        console.log(`Fetching images of ${fileId} for session: ${sessionId}`);

        const imageFills = nodes.filter(({ imageRef }) => !!imageRef) as {
            nodeId: string;
            imageRef: string;
            fileName: string;
        }[];

        const renderRequests = nodes
            .filter(({ imageRef }) => !imageRef)
            .map(({ pageId, nodeId, fileName }) => ({
                pageId,
                nodeId,
                fileName,
                fileType: fileName.endsWith(".svg") ? ("svg" as const) : ("png" as const),
            }));

        // 获取填充图片的blob数据
        const fillDownloads = await vextraService.getImageFillsAsBlob(fileId, imageFills);

        // 获取渲染图片的blob数据
        const renderDownloads = await vextraService.getImagesAsBlob(
            fileId,
            renderRequests,
            pngScale,
            svgOptions,
        );

        // 合并所有图片数据并上传到OSS
        const allImages = [...fillDownloads, ...renderDownloads];
        const storage = getStorage();
        // const signStorage = getSignStorage();

        if (!storage) {
            throw new Error("Storage not initialized");
        }

        const successImages = [];
        for (const image of allImages) {
            try {
                // 生成OSS文件路径
                const ossPath = fileCleanupService.generateFilePath(vextraService.startTime, sessionId, image.fileName);

                // 上传到OSS
                await storage.put(ossPath, image.data, image.mimeType);

                // 生成带签名的OSS访问链接（1小时有效期）
                // 将bucket改成public的，定期清理
                const ossUrl = getStoragePublicUrl().mcp + '/' + ossPath //await signStorage.signUrl(ossPath, 3600);

                successImages.push({
                    fileName: image.fileName,
                    mimeType: image.mimeType,
                    url: ossUrl,
                    size: image.data.length,
                });
            } catch (error) {
                console.error(`Failed to upload image ${image.fileName}:`, error);
            }
        }

        // 找出失败的图片（请求的但没有成功获取的）
        const successFileNames = new Set(successImages.map(img => img.fileName));
        const failedImages = nodes
            .map(node => node.fileName)
            .filter(fileName => !successFileNames.has(fileName))
            .map(fileName => ({ fileName, error: "Failed to fetch or render image" }));

        const result = {
            success_images: successImages,
            failed_images: failedImages,
        };

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
        console.error(`Error downloading images from file ${fileId}:`, error);
        return {
            isError: true,
            content: [{ type: "text" as const, text: `Error downloading images: ${error}` }],
        };
    }
}

export function registTools(server: McpServer, vextraService: VextraDataService, outputFormat: "yaml" | "json", sessionId: string, host: string) {
    server.tool(toolName, getDescription(host), getArgsSchema(host).shape, (args: z.infer<ArgsSchema>) => {
        return func(args, vextraService, outputFormat, sessionId);
    });
}