import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createRedisManager, getRedisManager, McpMessage } from "../providers/redis.js";
import { getRedisConfig } from "../config/index.js";
import { VextraDataService } from "@/data/vextra.js";

// 存储每个session的传输和MCP服务实例
const transports: Record<string, SSEServerTransport> = {};
const sessionMcpServers: Record<string, McpServer> = {};
const sessionVextraServices: Record<string, VextraDataService> = {};

export async function closeTransports() {
    for (const sessionId in transports) {
        try {
            await transports[sessionId]?.close();
            delete transports[sessionId];
        } catch (error) {
            console.error(`Error closing transport for session ${sessionId}:`, error);
        }
    }
}

/**
 * 处理从Redis接收到的消息
 */
export async function onSubscribeMcpMessage(sessionId: string, message: McpMessage) {
    if (message.type !== 'mcp_request') {
        return;
    }
    // 这是一个需要在本实例处理的请求
    const targetTransport = transports[sessionId];
    const targetMcpServer = sessionMcpServers[sessionId];
    if (!targetTransport || !targetMcpServer) {
        console.warn(`No transport or MCP server found for session ${sessionId}`);
        return;
    }
    
    // 创建一个模拟的请求对象来处理MCP消息
    const mockReq = {
        body: message.payload.body,
        headers: message.headers || {},
        query: message.query || {},
        method: 'POST',
        url: '/messages',
        on: (event: string, callback: Function) => {
            if (event === 'data') {
                callback(message.payload.body);
            } else if (event === 'end') {
                callback();
            }
        }
    } as any;

    const mockRes = {
        status: (code: number) => mockRes,
        json: (data: any) => mockRes,
        send: (data: any) => mockRes,
    } as any;

    try {
        // 处理MCP消息，响应会通过SSE自动发送给客户端
        await targetTransport.handlePostMessage(mockReq, mockRes);
    } catch (error) {
        console.error('Error processing Redis message:', error);
    }
}

/**
 * 初始化Redis服务
 */
export async function initializeRedisService(): Promise<void> {
    try {
        const redisConfig = getRedisConfig();
        const redisManager = createRedisManager(redisConfig);
        await redisManager.connect();
        console.log('Redis clustering enabled');

    } catch (error) {
        console.error('Failed to initialize Redis service:', error);
        throw error;
    }
}


/**
 * 注册会话的传输和MCP服务
 */
export function registerSession(sessionId: string, transport: SSEServerTransport, mcpServer: McpServer, vextraService: VextraDataService): void {
    transports[sessionId] = transport;
    sessionMcpServers[sessionId] = mcpServer;
    sessionVextraServices[sessionId] = vextraService;
}

/**
 * 订阅Redis频道
 */
export async function subscribeToRedisChannel(sessionId: string): Promise<void> {
    try {
        const redisManager = getRedisManager();
        const channel = redisManager.getChannelName(sessionId);
        await redisManager.subscribe(channel, async (message: McpMessage) => {
            await onSubscribeMcpMessage(sessionId, message);
        });
    } catch (error) {
        console.error(`Failed to subscribe to Redis channel for session ${sessionId}:`, error);
        throw error;
    }
}

/**
 * 取消订阅Redis频道并清理会话
 */
export async function cleanupSession(sessionId: string): Promise<void> {
    try {
        // 清理传输
        if (transports[sessionId]) {
            try {
                await transports[sessionId].close();
            } catch (error) {
                console.error(`Error closing transport for session ${sessionId}:`, error);
            }
            delete transports[sessionId];
        }

        // 清理MCP服务器
        if (sessionMcpServers[sessionId]) {
            delete sessionMcpServers[sessionId];
        }

        // 取消Redis订阅
        try {
            const redisManager = getRedisManager();
            const channel = redisManager.getChannelName(sessionId);
            await redisManager.unsubscribe(channel);
        } catch (error) {
            console.error(`Error unsubscribing from Redis channel for session ${sessionId}:`, error);
        }

        const vextraService = sessionVextraServices[sessionId];
        if (vextraService) {
            vextraService.close();
            // 清理会话相关的文件 // 不可以清理，清理后用户无法获取到文件
            // await cleanupSessionFiles(vextraService.startTime, sessionId);
            delete sessionVextraServices[sessionId];
        }
    } catch (error) {
        console.error(`Error cleaning up session ${sessionId}:`, error);
    }
}

/**
 * 通过Redis路由消息
 */
export async function routeMessageViaRedis(sessionId: string, req: any, res: any): Promise<boolean> {
    try {
        const redisManager = getRedisManager();
        const channel = redisManager.getChannelName(sessionId);

        if (!channel) {
            return false;
        }

        // 使用Redis路由消息到其他实例
        let body = '';
        req.on('data', (chunk: Buffer) => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const messageData: McpMessage = {
                type: 'mcp_request',
                sessionId,
                payload: {
                    body,
                },
                headers: req.headers as Record<string, string>,
                query: req.query as Record<string, any>,
            };

            try {
                // 发布请求消息到Redis
                await redisManager.publish(channel, messageData);

                // 立即返回202 Accepted，不等待响应
                res.status(202).json({ success: true, message: 'Message accepted and routed' });
            } catch (error) {
                console.error('Error publishing message to Redis:', error);
                res.status(500).json({ error: 'Failed to route message' });
            }
        });
        return true;
    } catch (error) {
        console.error('Error routing message via Redis:', error);
        res.status(500).json({ error: 'Failed to route message' });
        return false;
    }
}

/**
 * 关闭Redis连接
 */
export async function disconnectRedis(): Promise<void> {
    try {
        const redisManager = getRedisManager();
        await redisManager.disconnect();
    } catch (error) {
        console.error('Error disconnecting from Redis:', error);
    }
}

/**
 * 获取传输实例
 */
export function getTransport(sessionId: string): SSEServerTransport | undefined {
    return transports[sessionId];
}
