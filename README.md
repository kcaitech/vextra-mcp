# Vextra-MCP-Server

## 项目简介
这是一个基于 Node.js 和 TypeScript 构建的文件服务器项目，提供文件上传、转换等功能。

## 目录结构
```
project-root/
├── src/                     # 源代码目录
│   ├── config/             # 配置文件
│   ├── figmcpconvert/      # MCP 文件转换相关代码
│   ├── middlewares/        # Express 中间件
│   ├── utils/              # 工具函数
│   ├── index.ts            # 库入口文件
│   └── server.ts           # 服务器入口文件
├── scripts/                # 脚本文件
├── dist/                   # 编译后的代码
├── .gitignore             # Git 忽略文件
├── package.json           # 项目依赖和脚本
├── rollup.config.mjs      # Rollup 打包配置
├── tsconfig.json          # TypeScript 配置
└── README.md              # 项目说明文档
```

## 主要依赖
- express: Web 服务器框架
- @aws-sdk/client-s3: AWS S3 客户端
- ali-oss: 阿里云 OSS 客户端
- winston: 日志记录
- typescript: TypeScript 支持
- rollup: 代码打包工具

## 安装与运行

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建项目
```bash
npm run build
```

### 启动服务
```bash
npm start
```

服务将运行在配置的端口上（默认为 3002）。

## 开发说明

### 构建工具
项目使用 Rollup 进行打包，支持以下输出格式：
- CommonJS (cjs)
- ES Module (esm)

### 类型声明
项目使用 TypeScript 开发，会自动生成类型声明文件（.d.ts）。

### 环境要求
- Node.js 18.0.0 或更高版本
- npm 8.0.0 或更高版本