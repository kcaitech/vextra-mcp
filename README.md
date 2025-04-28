# Vextra-MCP-Server

## 项目简介
这是一个基于 Node.js 和 TypeScript 构建的服务端项目，具备生产环境的最佳实践。

## 目录结构
```
project-root/
├── src/                     # 源代码目录
│   ├── controllers/         # 控制器层，处理业务逻辑
│   ├── routes/              # 路由定义
│   ├── middlewares/         # 中间件
│   ├── models/              # 数据模型
│   ├── services/            # 服务层，处理复杂逻辑
│   ├── utils/               # 工具函数
│   ├── config/              # 配置文件（如环境变量、数据库配置等）
│   └── app.ts               # 应用入口文件
├── tests/                   # 测试代码
│   ├── unit/                # 单元测试
│   └── integration/         # 集成测试
├── public/                  # 静态资源（如图片、CSS、JS 文件等）
├── dist/                    # 编译后的代码（TypeScript 项目）
├── .env                     # 环境变量文件
├── .gitignore               # Git 忽略文件
├── package.json             # 项目依赖和脚本
├── tsconfig.json            # TypeScript 配置
└── README.md                # 项目说明文档
```

## 安装与运行

### 安装依赖
```bash
npm install
```

### 启动服务
```bash
npm start
```

服务将运行在 `http://localhost:3002`。

## 测试

### 运行单元测试
```bash
npm run test:unit
```

### 运行集成测试
```bash
npm run test:integration
```

## 依赖
- express
- dotenv
- winston
- typescript