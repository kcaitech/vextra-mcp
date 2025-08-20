import { getConfig } from "@/config";
import { Request, Response } from "express";
import { readFileSync } from "fs";
import { join } from "path";


/**
 * 处理 README 文件请求
 * 支持内容替换功能
 */
export function readmeHandler(req: Request, res: Response) {
    try {
        const filename = req.path;
        const webRoot = req.app.locals.webRoot;
        if (!webRoot || webRoot === '') {
            res.status(404).json({
                error: '404 Not Found',
            });
            return;
        }
        const filePath = join(webRoot, filename);
        // 读取文件内容
        let content = readFileSync(filePath, 'utf-8');

        const host = getConfig().server.host;
        if (host !== 'https://vextra.cn') {
            content = content.replaceAll('https://vextra.cn', host);
            content = content.replaceAll('https://mcp.vextra.cn', host);
        }

        // 设置响应头
        res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
        res.send(content);

    } catch (error) {
        console.error('Error serving README file:', error);
        res.status(404).json({
            error: '404 Not Found',
        });
    }
}
