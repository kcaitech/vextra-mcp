/*
 * Copyright (c) 2023-2025 KCai Technology (https://kcaitech.com). All rights reserved.
 *
 * This file is part of the Vextra project, which is licensed under the AGPL-3.0 license.
 * The full license text can be found in the LICENSE file in the root directory of this source tree.
 *
 * For more information about the AGPL-3.0 license, please visit:
 * https://www.gnu.org/licenses/agpl-3.0.html
 */

import express, { } from "express";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { Logger } from "./middlewares/logger.js";
import { createServer } from "./mcp_local";
import yargs from "yargs";

const transports = {} as Record<string, SSEServerTransport>

async function closeTransports(
    transports: Record<string, SSEServerTransport | StreamableHTTPServerTransport>,
) {
    for (const sessionId in transports) {
        try {
            await transports[sessionId]?.close();
            delete transports[sessionId];
        } catch (error) {
            console.error(`Error closing transport for session ${sessionId}:`, error);
        }
    }
}

export async function startHttpServer(port: number): Promise<void> {
    const mcpServer = createServer({
        outputFormat: "yaml" as "yaml" | "json"
    });

    const app = express();

    app.use(Logger);

    app.get("/sse", async (req, res) => {
        const transport = new SSEServerTransport("/messages", res);
        transports[transport.sessionId] = transport;
        res.on("close", () => {
            delete transports[transport.sessionId];
        });

        await mcpServer.connect(transport);
    });

    app.post("/messages", async (req, res) => {
        const sessionId = req.query.sessionId as string;
        const transport = transports[sessionId];
        if (transport) {
            await transport.handlePostMessage(req, res);
        } else {
            res.status(400).send(`No transport found for sessionId ${sessionId}`);
            return;
        }
    });

    app.listen(port, () => {
        console.log(`HTTP server listening on port ${port}`);
    });

    process.on("SIGINT", async () => {
        console.log("Shutting down server...");
        await closeTransports(transports);
        console.log("Server shutdown complete");
        process.exit(0);
    });
}

const args = yargs(process.argv).option('port', {
    type: 'number',
    describe: 'Port',
    demandOption: false,
    default: 8080
}).argv as { port: number };
const port = args.port;

startHttpServer(port).catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});
