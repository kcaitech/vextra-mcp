# 🚀 Vextra MCP Service

Vextra MCP Design File Service - Empowering AI assistants with powerful design file understanding and manipulation capabilities

## 📋 Service Overview

Vextra MCP Service is a Model Context Protocol (MCP) service based on the Vextra collaborative design platform, specifically tailored for AI assistants. It provides powerful design file format parsing, editing, and team collaboration capabilities, granting AI the revolutionary ability to understand and implement designs.

### Core Features

- **📁 Real-time Collaboration**: Support for online real-time editing, instantly sharing the latest design results with AI assistants
- **🔐 Secure Authentication**: Secure authentication mechanism based on access_key and access_secret
- **⚡ High Performance**: Backend cluster deployment with multi-instance load balancing and high availability
- **🔄 Real-time Communication**: Real-time bidirectional communication based on Server-Sent Events (SSE)

## 🔧 Cursor Configuration Guide

Configure the MCP Service in Cursor editor to enable AI assistants to access and process design files:

```json
{
  "mcpServers": {
    "Vextra MCP": {
      "url": "https://mcp.vextra.cn/sse?access_key=76fe38c3-319f-423d-96e6-069bd53e4f47&access_secret=********-****-****-****-************",
      "messageUrl": "https://mcp.vextra.cn/messages",
      "type": "sse",
      "headers": {
        "Accept": "text/event-stream",
        "Cache-Control": "no-cache"
      }
    }
  }
}
```

### Configuration Parameters
- **access_key & access_secret:** Login to [Vextra](https://vextra.cn) → Personal Center → Create New Access Key
- **url:** SSE connection endpoint for establishing real-time communication
- **messageUrl:** Message sending endpoint for sending MCP requests
- **type:** Transport type, using SSE (Server-Sent Events)
- **headers:** Required HTTP header settings

### Security Notes

- Please keep your access_key and access_secret secure and avoid leakage
- Do not expose authentication information in public code repositories

## 🚀 Quick Start

### 1. Get Access Key
Login to [Vextra](https://vextra.cn) platform and create a new Access Key in your personal center

### 2. Configure Cursor
Add the above configuration to Cursor's MCP settings

### 3. Prepare Design Document
Open the design document you want to implement in [Vextra](https://vextra.cn), select the canvas you need to implement, right-click menu → Copy as → Copy Selection Link, to get a link similar to:
```
https://vextra.cn/document/75417425-d04b-4878-a17f-a9936c4c384c/1459CE9A-B502-4C72-8EF0-CFDBB4DAA819/F2ACA917-F944-441E-A984-CAC3D51D95FB
```

### 4. Interact with Cursor
Give Cursor a task, for example:
```
Please implement this page using Vue+TypeScript: https://vextra.cn/document/75417425-d04b-4878-a17f-a9936c4c384c/1459CE9A-B502-4C72-8EF0-CFDBB4DAA819/F2ACA917-F944-441E-A984-CAC3D51D95FB
```

### 5. Complete Page Implementation
The AI assistant will parse the design file and generate corresponding code for you

## 🔧 Troubleshooting

### Common Issues
1. **MCP No Response**: If MCP is unresponsive for a long time, please close the Vextra MCP connection in Cursor and reopen it
2. **Connection Status Check**: Check if the MCP connection status is normal in Cursor
3. **Authentication Failed**: Please check if access_key and access_secret are correctly configured
