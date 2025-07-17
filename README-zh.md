# Vextra MCP Server

一个基于 [Model Context Protocol (MCP)](https://modelcontextprotocol.io) 的服务器，用于处理和解析 Vextra/Figma/Sketch/SVG 设计文件。

## 概述

Vextra MCP Server 是一个强大的设计文件处理工具，它通过 MCP 协议为 AI 助手（如 Cursor）提供了访问和操作设计文件的能力。支持多种设计文件格式，包括 Vextra、Figma、Sketch 和 SVG。

## 主要功能

- 🎨 **多格式支持**: 支持 `.vext`、`.sketch`、`.fig`、`.svg` 文件格式
- 📊 **布局信息提取**: 获取设计文件的详细布局和结构信息
- 🖼️ **图像渲染**: 将设计节点渲染为图像
- 📋 **页面信息查询**: 获取文件的页面结构和元数据
- 🔄 **实时通信**: 支持 SSE (Server-Sent Events) 和 HTTP 通信
- 🌐 **Cursor 集成**: 与 Cursor AI 助手无缝集成

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
npm start
```

## 配置

### 1. 配置 Cursor

在 Cursor 中添加以下 MCP 配置：

```json
{
  "Vextra MCP": {
    "url": "http://localhost:8080/sse",
    "messageUrl": "http://localhost:8080/messages",
    "type": "sse",
    "headers": {
      "Accept": "text/event-stream",
      "Cache-Control": "no-cache"
    }
  }
}
```

### 2. 服务器配置

服务器默认在 `http://localhost:8080` 启动，支持以下端点：

- `GET /sse` - SSE 连接端点
- `POST /messages` - HTTP 消息端点

## API 工具

### 1. Get Vextra Data

获取设计文件的布局信息和结构数据。

**参数:**
- `filePath` (必需): 本地文件路径
- `pageId` (可选): 页面 ID
- `nodeId` (可选): 节点 ID
- `depth` (可选): 遍历深度限制

**示例:**
```
获取完整文件信息
/path/to/file.sketch

获取特定页面
/path/to/file.sketch/pageId

获取特定节点
/path/to/file.sketch/pageId/nodeId
```

### 2. Get Vextra Images

将设计节点渲染为图像。

**参数:**
- `filePath` (必需): 本地文件路径
- `pageId` (必需): 页面 ID
- `nodeIds` (必需): 节点 ID 数组
- `format` (可选): 图像格式 (png, jpg, svg)
- `scale` (可选): 缩放比例

### 3. Get Vextra Pages Info

获取文件的页面结构和元数据。

**参数:**
- `filePath` (必需): 本地文件路径

**返回信息:**
- 页面 ID 和名称
- 节点数量统计
- 页面结构概览

## 使用示例

### 基本使用

在 Cursor 中，您可以这样使用：

```
解析设计文件
/path/to/file.sketch

获取特定页面信息
/path/to/file.sketch/pageId

提取页面中的所有图像
从 /path/to/file.sketch 的第一个页面提取所有图像
```

### 高级用法

```
分析大文件时限制深度
获取 /path/to/large-file.sketch 的布局信息，深度限制为 2 层

批量处理
获取 /path/to/design.fig 中所有页面的缩略图
```

## 项目结构

```
src/
├── data/           # 数据处理模块
│   ├── export/     # 数据导出相关
│   ├── source/     # 数据源处理
│   └── vextra.ts   # Vextra 服务核心
├── mcp/            # MCP 工具实现
│   ├── get_vextra_data.ts
│   ├── get_vextra_images.ts
│   └── get_vextra_pagesinfo.ts
├── middlewares/    # 中间件
└── server.ts       # 服务器入口
```

## 技术栈

- **Node.js** + **TypeScript** - 核心运行环境
- **Express.js** - Web 服务器框架
- **@modelcontextprotocol/sdk** - MCP 协议支持
- **@kcaitech/vextra-core** - Vextra 核心库
- **skia-canvas** - 图像渲染引擎
- **Rollup** - 打包工具

## 开发指南

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 开发脚本

```bash
npm run dev       # 开发模式
npm run build     # 构建生产版本
npm start         # 启动生产服务器
```

## 许可证

本项目采用 AGPL-3.0 许可证 - 详情请参阅 [LICENSE](LICENSE.txt) 文件。

## 作者

[KCai Technology](https://kcaitech.com)

## 相关链接

- [Vextra 官网](https://vextra.cn)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Cursor AI](https://cursor.sh)

---

如有问题或建议，请通过 GitHub Issues 联系我们。

