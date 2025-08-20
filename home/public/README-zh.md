# 🚀 Vextra MCP 服务

Vextra MCP 设计文件服务 - 为 AI 助手提供强大的设计文件理解与操作能力

## 📋 服务概述

Vextra MCP 服务是一个基于 Vextra 协作设计平台的 MCP（Model Context Protocol）服务，专为 AI 助手量身定制。它提供了强大的设计文件格式解析、编辑和团队协作能力，赋予 AI 理解设计、实现设计的全新能力。

### 核心功能

- **📁 实时协作**：支持线上实时编辑，即时与 AI 助手分享最新设计成果
- **🔐 安全认证**：基于 access_key 和 access_secret 的安全认证机制
- **⚡ 高性能**：后端集群部署，实现多实例负载均衡和高可用性
- **🔄 实时通信**：基于 Server-Sent Events (SSE) 的实时双向通信

## 🔧 Cursor 配置指南

在 Cursor 编辑器中配置 MCP 服务，让 AI 助手能够访问和处理设计文件：

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

### 配置参数说明
- **access_key & access_secret：** 登录 [Vextra](https://vextra.cn) → 个人中心 → 新建 Access Key 获取
- **url：** SSE 连接端点，用于建立实时通信连接
- **messageUrl：** 消息发送端点，用于发送 MCP 请求
- **type：** 传输类型，使用 SSE (Server-Sent Events)
- **headers：** 必要的 HTTP 头部设置

### 安全提示

- 请妥善保管您的 access_key 和 access_secret，避免泄露
- 不要在公开代码仓库中暴露认证信息

## 🚀 快速开始

### 1. 获取 Access Key
登录 [Vextra](https://vextra.cn) 平台，在个人中心创建新的 Access Key

### 2. 配置 Cursor
将上述配置添加到 Cursor 的 MCP 设置中

### 3. 准备设计文档
在 [Vextra](https://vextra.cn) 中打开您希望实现的设计文档，选中需要实现的画布，右键菜单 → 复制粘贴为 → 复制选取链接，获取类似如下的链接：
```
https://vextra.cn/document/75417425-d04b-4878-a17f-a9936c4c384c/1459CE9A-B502-4C72-8EF0-CFDBB4DAA819/F2ACA917-F944-441E-A984-CAC3D51D95FB
```

### 4. 与 Cursor 交互
给 Cursor 下达任务，例如：
```
请用vue+ts实现此页面：https://vextra.cn/document/75417425-d04b-4878-a17f-a9936c4c384c/1459CE9A-B502-4C72-8EF0-CFDBB4DAA819/F2ACA917-F944-441E-A984-CAC3D51D95FB
```

### 5. 完成页面实现
AI 助手将会解析设计文件并为您生成相应的代码

## 🔧 故障排除

### 常见问题
1. **MCP 长时间未响应**：请关闭 Cursor 中的 Vextra MCP 连接，然后重新打开
2. **连接状态检查**：在 Cursor 中查看 MCP 连接状态是否正常
3. **认证失败**：请检查 access_key 和 access_secret 是否正确配置
