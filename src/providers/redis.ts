import { createClient, RedisClientType } from "redis";

export const REDIS_CLEANUP_LOCK_KEY = "mcp:cleanup:lock";
export const REDIS_CLEANUP_LAST_TIME_KEY = "mcp:cleanup:last_time";
export const REDIS_SESSION_KEY = "mcp:session:";

export interface RedisConfig {
    addr: string;
    password?: string;
    db?: number;
}

export interface McpMessage {
    type: 'mcp_request';
    sessionId: string;
    payload: any;
    headers?: Record<string, string>;
    query?: Record<string, any>;
}

export class RedisManager {
    private publisher: RedisClientType;
    private subscriber: RedisClientType;
    private messageHandlers: Map<string, (message: McpMessage) => void> = new Map();

    constructor(config: RedisConfig) {
        const clientConfig = {
            url: 'redis://' + config.addr,
            username: 'default',
            password: config.password,
            database: config.db || 0,
        };

        this.publisher = createClient(clientConfig);
        this.subscriber = createClient(clientConfig);

        this.setupSubscriber();
    }

    private setupSubscriber(): void {
        this.subscriber.on("message", (channel: string, message: string) => {
            const handler = this.messageHandlers.get(channel);
            if (handler) {
                try {
                    const messageData: McpMessage = JSON.parse(message);
                    handler(messageData);
                } catch (error) {
                    console.error('Error parsing Redis message:', error);
                }
            }
        });

        this.subscriber.on("error", (err: Error) => {
            console.error("Redis subscriber error:", err);
        });

        this.subscriber.on("connect", () => {
            console.log("Redis subscriber connected");
        });

        this.subscriber.on("disconnect", () => {
            console.log("Redis subscriber disconnected");
        });

        this.publisher.on("error", (err: Error) => {
            console.error("Redis publisher error:", err);
        });

        this.publisher.on("connect", () => {
            console.log("Redis publisher connected");
        });

        this.publisher.on("disconnect", () => {
            console.log("Redis publisher disconnected");
        });
    }

    async connect(): Promise<void> {
        try {
            await Promise.all([
                this.publisher.connect(),
                this.subscriber.connect(),
            ]);
            console.log("Redis connected successfully");
        } catch (error) {
            console.error("Failed to connect to Redis:", error);
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        try {
            if (this.publisher.isOpen) {
                await this.publisher.disconnect();
            }
            if (this.subscriber.isOpen) {
                await this.subscriber.disconnect();
            }
            console.log("Redis disconnected");
        } catch (error) {
            console.error("Error disconnecting from Redis:", error);
        }
    }

    async publish(channel: string, message: McpMessage): Promise<void> {
        try {
            await this.publisher.publish(channel, JSON.stringify(message));
        } catch (error) {
            console.error(`Failed to publish message to channel ${channel}:`, error);
            throw error;
        }
    }

    async subscribe(channel: string, handler: (message: McpMessage) => void): Promise<void> {
        try {
            this.messageHandlers.set(channel, handler);
            await this.subscriber.subscribe(channel, (message: string) => {
                // This callback is handled by the 'message' event listener
            });
        } catch (error) {
            console.error(`Failed to subscribe to channel ${channel}:`, error);
            throw error;
        }
    }

    async unsubscribe(channel: string): Promise<void> {
        try {
            this.messageHandlers.delete(channel);
            await this.subscriber.unsubscribe(channel);
        } catch (error) {
            console.error(`Failed to unsubscribe from channel ${channel}:`, error);
            throw error;
        }
    }

    getChannelName(sessionId: string): string {
        return `${REDIS_SESSION_KEY}${sessionId}`;
    }

    /**
     * 设置带过期时间的键值对（用于分布式锁）
     * 使用SET NX EX命令，只有在键不存在时才设置
     */
    async setWithExpiry(key: string, value: string, ttlSeconds: number): Promise<boolean> {
        try {
            // 使用SET NX EX命令，只有在键不存在时才设置
            const result = await this.publisher.set(key, value, {
                NX: true,  // 只在键不存在时设置
                EX: ttlSeconds  // 设置过期时间
            });
            
            // 如果返回OK，说明设置成功（键不存在）
            // 如果返回null，说明键已存在
            return result === 'OK';
        } catch (error) {
            console.error(`Failed to set key ${key} with expiry:`, error);
            return false;
        }
    }

    /**
     * 删除键
     */
    async delete(key: string): Promise<void> {
        try {
            await this.publisher.del(key);
        } catch (error) {
            console.error(`Failed to delete key ${key}:`, error);
            throw error;
        }
    }

    /**
     * 获取键值
     */
    async get(key: string): Promise<string | null> {
        try {
            return await this.publisher.get(key);
        } catch (error) {
            console.error(`Failed to get key ${key}:`, error);
            return null;
        }
    }

    /**
     * 设置键值
     */
    async set(key: string, value: string): Promise<void> {
        try {
            await this.publisher.set(key, value);
        } catch (error) {
            console.error(`Failed to set key ${key}:`, error);
            throw error;
        }
    }

    /**
     * Ping Redis服务器
     */
    async ping(): Promise<string> {
        try {
            return await Promise.all([this.publisher.ping(), this.subscriber.ping()]).then(([publisherPing, subscriberPing]) => {
                if (publisherPing.toUpperCase() === 'PONG' && subscriberPing.toUpperCase() === 'PONG') {
                    return 'PONG';
                }
                throw new Error('Redis ping failed');
            });
        } catch (error) {
            console.error('Failed to ping Redis:', error);
            throw error;
        }
    }
}

// 单例模式
let redisManager: RedisManager | null = null;

export function createRedisManager(config: RedisConfig): RedisManager {
    if (!redisManager) {
        redisManager = new RedisManager(config);
    }
    return redisManager;
}

export function getRedisManager(): RedisManager {
    if (!redisManager) {
        throw new Error('Redis manager not initialized');
    }
    return redisManager;
}