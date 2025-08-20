import { AuthConfig } from "../config/index.js";
import https from 'https';
import http from 'http';

export interface AuthCredentials {
    access_key: string;
    access_secret: string;
}

export interface TokenResponse {
    token: string;
    expire: number;
}

export class AuthService {
    private config: AuthConfig;
    private tokenCache: Map<string, { token: string; expire: number }> = new Map();

    constructor(config: AuthConfig) {
        this.config = config;
    }

    /**
     * 获取访问令牌
     */
    async getAccessToken(credentials: AuthCredentials): Promise<string> {
        const cacheKey = `${credentials.access_key}:${credentials.access_secret}`;

        // 检查缓存
        const cached = this.tokenCache.get(cacheKey);
        if (cached && cached.expire > Date.now() + 10 * 1000) { // 多预留10秒
            return cached.token;
        }

        const tokenUrl = `${this.config.addr}`;
        const url = new URL(tokenUrl);

        const postData = JSON.stringify({
            access_key: credentials.access_key,
            access_secret: credentials.access_secret,
            expire: this.config.expire,
        });

        const options = {
            hostname: url.hostname,
            port: url.port || (url.protocol === 'https:' ? 443 : 80),
            path: url.pathname + url.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
            },
            // 忽略SSL证书验证
            rejectUnauthorized: false,
        };
        const client = url.protocol === 'https:' ? https : http;
        return new Promise((resolve, reject) => {
            const req = client.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                        try {
                            const responseData: TokenResponse = JSON.parse(data)?.data;

                            if (!responseData || !responseData.token) {
                                console.log(data)
                                reject(new Error('Invalid response: missing token'));
                                return;
                            }

                            // 缓存token（使用配置中的默认过期时间）
                            const expiresIn = responseData.expire || this.config.expire;
                            const expires = Date.now() + (expiresIn * 1000);
                            this.tokenCache.set(cacheKey, { token: responseData.token, expire: expires });

                            console.log(`Token obtained for access_key: ${credentials.access_key}`);
                            resolve(responseData.token);
                        } catch (error) {
                            reject(new Error(`Failed to parse response: ${error}`));
                        }
                    } else {
                        reject(new Error(`Authentication failed: ${res.statusCode} ${res.statusMessage} ${data}`));
                    }
                });
            });

            req.on('error', (error) => {
                reject(new Error(`Request failed: ${error.message}`));
            });

            req.write(postData);
            req.end();
        });
    }

    /**
     * 清除token缓存
     */
    clearTokenCache(credentials?: AuthCredentials): void {
        if (credentials) {
            const cacheKey = `${credentials.access_key}:${credentials.access_secret}`;
            this.tokenCache.delete(cacheKey);
        } else {
            this.tokenCache.clear();
        }
    }

    /**
     * 清理过期的token
     */
    cleanupExpiredTokens(): void {
        const now = Date.now();
        const expiredKeys: string[] = [];

        for (const [key, value] of this.tokenCache) {
            if (value.expire <= now) {
                expiredKeys.push(key);
            }
        }

        expiredKeys.forEach(key => this.tokenCache.delete(key));

        if (expiredKeys.length > 0) {
            console.log(`Cleaned up ${expiredKeys.length} expired tokens`);
        }
    }

    /**
     * 获取配置信息
     */
    getConfig(): AuthConfig {
        return { ...this.config };
    }

    /**
     * 获取缓存统计信息
     */
    getCacheStats(): { total: number; valid: number; expired: number } {
        const now = Date.now();
        let valid = 0;
        let expired = 0;

        for (const [, value] of this.tokenCache) {
            if (value.expire > now) {
                valid++;
            } else {
                expired++;
            }
        }

        return {
            total: this.tokenCache.size,
            valid,
            expired,
        };
    }
}

// 单例模式
let authService: AuthService | null = null;

export function initAuthService(config: AuthConfig): AuthService {
    if (authService) {
        return authService;
    }

    authService = new AuthService(config);
    let cleanupInterval: NodeJS.Timeout | null = setInterval(() => {
        authService!.cleanupExpiredTokens();
    }, config.expire * 1000);
    const cleanup = () => {
        if (cleanupInterval) {
            clearInterval(cleanupInterval);
            cleanupInterval = null;
        }
    }
    process.on('exit', cleanup);
    process.on('SIGTERM', cleanup);
    process.on('SIGINT', cleanup);
    return authService;
}

export function getAuthService(): AuthService {
    if (!authService) {
        throw new Error("Authentication service not available");
    }
    return authService;
}