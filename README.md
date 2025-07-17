# Vextra MCP Server

A server based on [Model Context Protocol (MCP)](https://modelcontextprotocol.io) for processing and parsing Vextra/Figma/Sketch/SVG design files.

## Overview

Vextra MCP Server is a powerful design file processing tool that provides AI assistants (like Cursor) with the ability to access and manipulate design files through the MCP protocol. It supports multiple design file formats including Vextra, Figma, Sketch, and SVG.

## Key Features

- 🎨 **Multi-format Support**: Supports `.vext`, `.sketch`, `.fig`, `.svg` file formats
- 📊 **Layout Information Extraction**: Retrieves detailed layout and structure information from design files
- 🖼️ **Image Rendering**: Renders design nodes as images
- 📋 **Page Information Query**: Retrieves page structure and metadata
- 🔄 **Real-time Communication**: Supports SSE (Server-Sent Events) and HTTP communication
- 🌐 **Cursor Integration**: Seamlessly integrates with Cursor AI assistant

## Quick Start

### Install Dependencies

```bash
npm install
```

### Development Mode

```bash
npm run dev
```

### Build Production Version

```bash
npm run build
npm start
```

## Configuration

### 1. Configure Cursor

Add the following MCP configuration in Cursor:

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

### 2. Server Configuration

The server starts by default at `http://localhost:8080` and supports the following endpoints:

- `GET /sse` - SSE connection endpoint
- `POST /messages` - HTTP message endpoint

## API Tools

### 1. Get Vextra Data

Retrieves layout information and structure data from design files.

**Parameters:**
- `filePath` (required): Local file path
- `pageId` (optional): Page ID
- `nodeId` (optional): Node ID
- `depth` (optional): Traversal depth limit

**Examples:**
```
Get complete file information
/path/to/file.sketch

Get specific page
/path/to/file.sketch/pageId

Get specific node
/path/to/file.sketch/pageId/nodeId
```

### 2. Get Vextra Images

Renders design nodes as images.

**Parameters:**
- `filePath` (required): Local file path
- `pageId` (required): Page ID
- `nodeIds` (required): Array of node IDs
- `format` (optional): Image format (png, jpg, svg)
- `scale` (optional): Scale ratio

### 3. Get Vextra Pages Info

Retrieves page structure and metadata from files.

**Parameters:**
- `filePath` (required): Local file path

**Returns:**
- Page IDs and names
- Node count statistics
- Page structure overview

## Usage Examples

### Basic Usage

In Cursor, you can use it like this:

```
Parse design file
/path/to/file.sketch

Get specific page information
/path/to/file.sketch/pageId

Extract all images from a page
Extract all images from the first page of /path/to/file.sketch
```

### Advanced Usage

```
Limit depth when analyzing large files
Get layout information from /path/to/large-file.sketch with depth limit of 2 layers

Batch processing
Get thumbnails for all pages in /path/to/design.fig
```

## Project Structure

```
src/
├── data/           # Data processing modules
│   ├── export/     # Data export related
│   ├── source/     # Data source processing
│   └── vextra.ts   # Vextra service core
├── mcp/            # MCP tool implementations
│   ├── get_vextra_data.ts
│   ├── get_vextra_images.ts
│   └── get_vextra_pagesinfo.ts
├── middlewares/    # Middlewares
└── server.ts       # Server entry point
```

## Tech Stack

- **Node.js** + **TypeScript** - Core runtime environment
- **Express.js** - Web server framework
- **@modelcontextprotocol/sdk** - MCP protocol support
- **@kcaitech/vextra-core** - Vextra core library
- **skia-canvas** - Image rendering engine
- **Rollup** - Build tool

## Development Guide

### Environment Requirements

- Node.js >= 16.0.0
- npm >= 8.0.0

### Development Scripts

```bash
npm run dev       # Development mode
npm run build     # Build production version
npm start         # Start production server
```

## License

This project is licensed under the AGPL-3.0 License - see the [LICENSE](LICENSE.txt) file for details.

## Author

[KCai Technology](https://kcaitech.com)

## Related Links

- [Vextra Official Website](https://vextra.cn)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Cursor AI](https://cursor.sh)

---

If you have any questions or suggestions, please contact us through GitHub Issues. 
