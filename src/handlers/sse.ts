import { AuthCredentials, getAuthService } from "@/providers/auth";
import { cleanupSession, getTransport, registerSession, routeMessageViaRedis, subscribeToRedisChannel } from "@/services/redis-service";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { Request, Response } from "express";
import { createServer } from "@/mcp/index.ts";
import { getServerConfig } from "@/config";

export async function sseHandler(req: Request, res: Response) {
    let sessionId: string | undefined = undefined;
    let keepAliveInterval: NodeJS.Timeout | undefined = undefined;

    // 统一的清理函数
    const cleanup = async () => {
        if (keepAliveInterval) {
            clearInterval(keepAliveInterval);
            keepAliveInterval = undefined;
        }
        if (sessionId) {
            console.log(`SSE connection closed for session: ${sessionId}`);
            await cleanupSession(sessionId);
            sessionId = undefined;
        }
    };

    try {
        // 解析查询参数获取认证信息
        const access_key = req.query.access_key as string;
        const access_secret = req.query.access_secret as string;

        if (!access_key || !access_secret) {
            res.status(400).json({
                error: 'Missing required parameters: access_key and access_secret'
            });
            return;
        }

        const credentials: AuthCredentials = { access_key, access_secret };

        // 验证认证信息并获取token
        const authService = getAuthService();
        if (!authService) {
            res.status(500).json({ error: 'Authentication service not available' });
            return;
        }

        const token = () => authService.getAccessToken(credentials);

        // 创建SSE传输
        const transport = new SSEServerTransport("/messages", res);
        sessionId = transport.sessionId;
        const serverConfig = getServerConfig();
        // 为该session创建专用的MCP服务
        const { mcpServer, vextraService } = createServer(token, sessionId, {
            outputFormat: serverConfig.outputFormat,
            host: serverConfig.host
        });

        // 注册会话
        registerSession(sessionId, transport, mcpServer, vextraService);

        // 订阅Redis频道
        await subscribeToRedisChannel(sessionId);

        // 设置连接保活定时器
        keepAliveInterval = setInterval(() => {
            if (!res.destroyed) {
                // res.write('data: ' + JSON.stringify({
                //     jsonrpc: "2.0",
                //     method: "keepalive",
                //     params: {}
                // }) + '\n\n');
                res.write('event: keepalive\n\n');
            }
        }, 30000); // 每30秒发送一次保活消息

        // 监听连接关闭事件
        res.on("close", cleanup);

        // 监听错误事件
        res.on("error", cleanup);

        // 连接MCP服务
        await mcpServer.connect(transport);

    } catch (error) {
        console.error('Error establishing SSE connection:', error);
        await cleanup();
        // 如果响应还没有发送，发送错误响应
        if (!res.headersSent) {
            res.status(401).json({
                error: 'Authentication failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        } else {
            // 如果响应已经开始，发送错误事件
            res.write('data: {"type":"error","message":"' + (error instanceof Error ? error.message : 'Unknown error') + '"}\n\n');
        }
    }
}

export async function messagesHandler(req: Request, res: Response) {
    try {
        const sessionId = req.query.sessionId as string;
        const transport = getTransport(sessionId);
        if (transport) {
            await transport.handlePostMessage(req, res);
            return;
        }
        // 尝试通过Redis路由消息
        const routed = await routeMessageViaRedis(sessionId, req, res);
        if (!routed) {
            res.status(400).send(`No transport found for sessionId ${sessionId}`);
        }
    } catch (error) {
        console.error('Error handling message:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}