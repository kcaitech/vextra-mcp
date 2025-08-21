/*
 * Copyright (c) 2023-2025 KCai Technology (https://kcaitech.com). All rights reserved.
 *
 * This file is part of the Vextra project, which is licensed under the AGPL-3.0 license.
 * The full license text can be found in the LICENSE file in the root directory of this source tree.
 *
 * For more information about the AGPL-3.0 license, please visit:
 * https://www.gnu.org/licenses/agpl-3.0.html
 */

import fs from 'fs';
import yaml from 'js-yaml';

// 配置接口定义
export interface ServerConfig {
    outputFormat: 'yaml' | 'json';
    debug: boolean;
    cors: boolean;
    host: string;
    at: 'server' | 'client';
}

export interface RedisConfig {
    addr: string;
    password: string;
    db: number;
}

export interface AuthConfig {
    addr: string;
    expire: number;
}

export type Storage = {
    provider: string,
    endpoint: string,
    region: string,
    accessKeyID: string,
    secretAccessKey: string,
    mcpBucket: string,
}

export type StoragePublicUrl = {
    mcp: string
}

export interface AppConfig {
    server: ServerConfig;
    redis: RedisConfig;
    auth: AuthConfig;
    ws_url: string;
    storage: Storage;
    storage_public_url: StoragePublicUrl;
}

function deepMerge(target: any, source: any) {
    const result = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }

class ConfigManager {
    private static instance: ConfigManager;
    private config: AppConfig | null = null;
    private environment: string;

    private constructor() {
        this.environment = process.env.NODE_ENV || 'development';
    }

    public static getInstance(): ConfigManager {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }

    /**
     * 加载配置文件
     */
    public loadConfig(configPath: string): AppConfig {
        if (this.config) {
            throw new Error('Config already loaded');
        }

        try {
            const configContent = fs.readFileSync(configPath, 'utf8');
            this.config = yaml.load(configContent) as AppConfig;
            console.log(`Configuration loaded from: ${configPath} ${configContent}`);
            return this.config!;
        } catch (error) {
            console.error(`Failed to load configuration from ${configPath}:`, error);
            throw new Error(`Configuration loading failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * 获取当前环境
     */
    public getEnvironment(): string {
        return this.environment;
    }

    /**
     * 获取配置
     */
    public getConfig(): AppConfig {
        if (!this.config) {
            throw new Error('Config not loaded');
        }
        return this.config!;
    }

    /**
     * 获取Redis配置（如果启用）
     */
    public getRedisConfig(): RedisConfig {
        const config = this.getConfig();
        return config.redis;
    }

    /**
     * 检查是否为开发环境
     */
    public isDevelopment(): boolean {
        return this.environment === 'development';
    }

    /**
     * 检查是否为生产环境
     */
    public isProduction(): boolean {
        return this.environment === 'production';
    }
}

// 导出配置管理器实例
export const configManager = ConfigManager.getInstance();

// 导出配置获取函数
export function getConfig(): AppConfig {
    return configManager.getConfig();
}

export function getRedisConfig(): RedisConfig {
    return configManager.getRedisConfig();
}

export function getServerConfig(): ServerConfig {
    return configManager.getConfig().server;
}

export function getAuthConfig(): AuthConfig {
    return configManager.getConfig().auth;
}

export function getWsUrl(): string {
    return configManager.getConfig().ws_url;
}

export function getStorageConfig(): Storage {
    return configManager.getConfig().storage;
}

export function getStoragePublicUrl(): StoragePublicUrl {
    return configManager.getConfig().storage_public_url;
}

// 初始化配置
export function initializeConfig(configPath: string, host?: string): AppConfig {
    const cfg = configManager.loadConfig(configPath);
    if (host && host !== '') {
        cfg.server.host = host;
    } else if (!cfg.server.host || cfg.server.host === '') {
        cfg.server.host = 'https://vextra.cn';
    }
    if (!cfg.server.outputFormat || (cfg.server.outputFormat as string) === '') {
        cfg.server.outputFormat = 'yaml';
    }
    return cfg;
}