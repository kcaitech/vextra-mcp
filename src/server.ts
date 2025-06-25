import express, {  } from "express";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { Server } from "http";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Logger } from "./middlewares/logger.js";


import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./mcp";
import yargs from "yargs";


let httpServer: Server | null = null;
const transports = {
  // streamable: {} as Record<string, StreamableHTTPServerTransport>,
  sse: {} as Record<string, SSEServerTransport>,
};

export async function startHttpServer(port: number, mcpServer: McpServer): Promise<void> {
  const app = express();

  app.use(Logger);

  app.get("/sse", async (req, res) => {
    const transport = new SSEServerTransport("/messages", res);
    transports.sse[transport.sessionId] = transport;
    res.on("close", () => {
      delete transports.sse[transport.sessionId];
    });

    await mcpServer.connect(transport);
  });

  app.post("/messages", async (req, res) => {
    const sessionId = req.query.sessionId as string;
    const transport = transports.sse[sessionId];
    if (transport) {
      await transport.handlePostMessage(req, res);
    } else {
      res.status(400).send(`No transport found for sessionId ${sessionId}`);
      return;
    }
  });

  httpServer = app.listen(port, () => {
    console.log(`HTTP server listening on port ${port}`);
    console.log(`SSE endpoint available at http://localhost:${port}/sse`);
    console.log(`Message endpoint available at http://localhost:${port}/messages`);
    // console.log(`StreamableHTTP endpoint available at http://localhost:${port}/mcp`);
  });

  process.on("SIGINT", async () => {
    console.log("Shutting down server...");

    // Close all active transports to properly clean up resources
    await closeTransports(transports.sse);
    // await closeTransports(transports.streamable);

    console.log("Server shutdown complete");
    process.exit(0);
  });
}

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

export async function stopHttpServer(): Promise<void> {
  if (!httpServer) {
    throw new Error("HTTP server is not running");
  }

  return new Promise((resolve, reject) => {
    httpServer!.close((err: Error | undefined) => {
      if (err) {
        reject(err);
        return;
      }
      httpServer = null;
      const closing = Object.values(transports.sse).map((transport) => {
        return transport.close();
      });
      Promise.all(closing).then(() => {
        resolve();
      });
    });
  });
}


export async function startServer(token: string): Promise<void> {
  // Check if we're running in stdio mode (e.g., via CLI)
  const isStdioMode = process.env.NODE_ENV === "cli" || process.argv.includes("--stdio");

  const config = {
    auth: token,
    outputFormat: "yaml" as "yaml" | "json",
    port: 80,
  }

  const server = createServer(config.auth, {
    isHTTP: !isStdioMode,
    outputFormat: config.outputFormat
  });

  if (isStdioMode) {
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } else {
    await startHttpServer(config.port, server);
  }
}

// If we're being executed directly (not imported), start the server
if (process.argv[1]) {
  // 用yargs从运行参数中获取token
  const args = yargs(process.argv).option('token', {
    type: 'string',
    describe: 'Authentication token',
    demandOption: true
  }).argv as { token: string };
  const token = args.token;

  startServer(token).catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
}