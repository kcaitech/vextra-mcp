import express, { } from "express";
import { Logger } from "./middlewares/logger.ts";
import { initAuthService } from "./providers/auth.ts";
import {
    initializeConfig,
} from "./config/index.ts";
import {
    initializeRedisService,
    disconnectRedis,
    closeTransports,
} from "./services/redis-service.ts";

import { healthHandler } from "./handlers/health.ts";
import { messagesHandler, sseHandler } from "./handlers/sse.ts";
import { readmeHandler } from "./handlers/readme.ts";
import { initSignStorage, initStorage } from "./services/storage.ts";
import { startScheduledCleanup } from "./services/scheduled-cleanup.ts";

export async function startHttpServer(port: number, webRoot: string): Promise<void> {
    const app = express();    
    // 设置 webRoot 到 app.locals 供处理器使用
    app.locals.webRoot = webRoot;
    // 处理 README
    app.get("/README-en.md", readmeHandler);
    app.get("/README-zh.md", readmeHandler);
    // 静态资源处理 - 为Vue首页提供静态文件
    app.use('/', express.static(webRoot));
    app.get("/health", healthHandler);
    
    app.use(Logger);

    app.get("/sse", sseHandler);
    app.post("/messages", messagesHandler);

    app.listen(port, () => {
        console.log(`HTTP server listening on ${port}`);
    });

    process.on("SIGINT", async () => {
        console.log("Shutting down server...");
        await disconnectRedis();
        await closeTransports();
        console.log("Server shutdown complete");
        process.exit(0);
    });
}

export async function startServer(configPath: string, port: number, webRoot: string, host?: string): Promise<void> {
    // 初始化配置
    const config = initializeConfig(configPath, host);

    initAuthService(config.auth);
    await initStorage(config.storage)
    // await initSignStorage(config.storage)
    // 初始化Redis服务
    await initializeRedisService();
    startScheduledCleanup();
    await startHttpServer(port, webRoot);
}

const defaultPort = 8080;
const defaultConfigPath = "config/config.yaml";
const defaultWebRoot = "/app/home";

// 支持通过命令行参数覆盖配置 - 使用动态导入处理 ES Module
async function parseArgs() {
    const yargs = await import("yargs");
    const args = yargs.default(process.argv)
        .option('config', {
            type: 'string',
            describe: 'Path to configuration file',
            default: defaultConfigPath
        })
        .option('port', {
            type: 'number',
            describe: 'Port to listen on',
            default: defaultPort
        })
        .option('web', {
            type: 'string',
            describe: 'Web root directory',
            default: defaultWebRoot
        })
        .option('host', {
            type: 'string',
            describe: 'Host to listen on'
        })
        .help()
        .argv as {
            config: string;
            port: number;
            web: string;
            host?: string;
        };
    return args;
}

parseArgs().then(args => {
    console.log("args:", args);
    return startServer(args.config, args.port, args.web, args.host);
}).catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});
