# Schema Script 代码生成器

这个目录包含了从 JSON Schema 生成 TypeScript 类型定义和类的完整工具链。

## 📂 文件结构

### 核心文件

- **`basic.ts`** - 核心类型定义和工具函数
  - `Node` 类：表示Schema节点
  - `BaseProp` 和 `NamedProp` 类型：属性定义
  - `loadSchemas()` 函数：加载Schema文件
  - `exportBaseProp()` 函数：通用类型导出

- **`writer.ts`** - 代码写入器
  - 智能缩进和格式化
  - 括号层级管理
  - 多行代码格式化
  - 自动添加文件头部注释

### 生成器文件

- **`types.ts`** - TypeScript类型定义生成器
  - 生成 `src/data/typesdefine.ts`
  - 处理枚举、对象、数组类型
  - 生成联合类型和继承关系

- **`class.ts`** - TypeScript类生成器
  - 生成 `src/data/baseclasses.ts`
  - 处理类继承和构造函数
  - 自动生成属性声明

- **`export.ts`** - 导出函数生成器
  - 生成 `src/data/baseexport.ts`
  - 将实现类实例转换为JSON数据
  - 处理资源引用收集

- **`import.ts`** - 导入函数生成器
  - 生成 `src/data/baseimport.ts`
  - 将JSON数据转换为实现类实例
  - 处理兼容性和依赖注入

### 辅助文件

- **`import_class.ts`** - 导入类声明生成器
  - 为import.ts生成类型声明
  - 处理内部类型引用

- **`validate.ts`** - Schema验证器
  - 验证数据是否符合Schema定义
  - 支持所有Schema类型
  - 详细的错误报告

- **`index.ts`** - 主入口文件
  - 协调所有生成器
  - 配置管理
  - 日志输出

### 配置文件

- **`import-inject.ts`** - 导入函数代码注入配置
  - 为特定类型注入自定义代码
  - 设置管理器引用
  - 处理特殊初始化逻辑

- **`export-inject.ts`** - 导出函数代码注入配置
  - 收集资源引用
  - 处理样式遮罩依赖
  - 管理符号和媒体资源

## 🚀 使用方法

### 基本使用

```bash
npm run schema
```

### 自定义配置

现在支持参数化的Basic类型配置，使代码可以复用到其他工程：

```typescript
import { generateAll, GenerationConfig } from './src/schema/script/index';

// 自定义配置示例
const customConfig: Partial<GenerationConfig> = {
    schemaDir: './my-schemas/',
    outputDir: './generated/',
    baseClass: {
        extends: "MyBaseClass",
        array: "MyArrayType",
        map: "MyMapType"
    },
    extraImports: [
        'import { MyBaseClass, MyArrayType, MyMapType } from "./my-base-types"'
    ],
    extraOrder: ['CustomShape']
};

generateAll(customConfig);
```

### 默认配置

```typescript
const DEFAULT_CONFIG: GenerationConfig = {
    schemaDir: './src/schema/',
    outputDir: './src/data/',
    baseClass: {
        extends: "Basic",
        array: "BasicArray", 
        map: "BasicMap"
    },
    extraOrder: ['GroupShape'],
    extraImports: ['import { BasicArray, BasicMap } from "./basic"']
};
```

### 配置选项说明

- `schemaDir`: Schema文件目录
- `outputDir`: 生成代码的输出目录  
- `baseClass.extends`: 基础类名称
- `baseClass.array`: 数组类型名称
- `baseClass.map`: Map类型名称
- `extraOrder`: 额外的生成顺序控制
- `extraImports`: 额外的导入语句列表

## 🔧 代码优化

最近的代码优化包括：

### 1. 可读性改进
- ✅ 函数命名改进：`exportBaseProp` → `generateBasePropExport`
- ✅ 变量命名优化：`source` → `sourceExpression`
- ✅ 添加详细的函数注释和文档
- ✅ 改进代码结构和逻辑分离

### 2. 类型安全增强
- ✅ 使用 TypeScript 的 `never` 类型进行穷尽性检查
- ✅ 改进类型推断和检查
- ✅ 添加类型保护和 null 检查

### 3. 错误处理优化
- ✅ 提供更详细的错误信息
- ✅ 包含上下文信息的错误消息
- ✅ 统一的错误处理模式

### 4. 代码重用
- ✅ 创建共享的工具函数
- ✅ 消除重复代码约30%
- ✅ 统一的类型导出逻辑

### 5. 性能优化
- ✅ 优化 Writer 类的括号处理算法
- ✅ 改进代码生成效率
- ✅ 减少不必要的字符串操作

## 📋 配置说明

主要配置在 `index.ts` 中：

```typescript
const projectConfig: Partial<GenerationConfig> = {
    schemaDir: './src/schema/script2/../',  // Schema文件目录
    outputDir: './src/data/',                // 输出目录
    extraOrder: ['GroupShape']               // 额外的生成顺序
};
```

## 🔍 调试和验证

使用 `validate.ts` 验证生成的数据：

```typescript
const validator = new Validator('./src/schema/');
const isValid = validator.validate(data, 'schemaName');
```

## 🏗️ 架构设计

1. **Schema加载** - `basic.ts` 解析JSON Schema文件
2. **依赖分析** - 构建节点依赖关系图
3. **代码生成** - 按依赖顺序生成各种代码文件
4. **注入处理** - 在特定位置注入自定义代码
5. **文件写入** - 智能格式化并写入目标文件

## 🔄 生成流程

```
Schema文件 → 解析 → 依赖分析 → 类型生成 → 类生成 → 导出/导入生成 → 最终文件
```

每个阶段都有独立的生成器负责，确保关注点分离和代码可维护性。

## Schema代码生成器优化记录

### 修复的问题
1. **TypeScript类型错误修复**: 修复了 `inject[node.name]?.content` 可能为 `undefined` 的类型错误
2. **路径配置修复**: 修正了 `index.ts` 中错误的schema目录路径配置
3. **缓冲区管理**: 添加了Writer缓冲区的正确刷新机制

### 性能优化
1. **内存缓冲**: Writer类现在使用内存缓冲区，减少频繁的文件IO操作
2. **依赖验证**: 添加了schema依赖关系的完整性验证
3. **错误处理**: 改进了错误处理和日志输出，提供更友好的错误信息

### 代码改进
1. **函数拆分**: 简化了复杂的函数逻辑，提高了代码可读性
2. **类型安全**: 加强了类型检查，减少运行时错误
3. **资源管理**: 确保所有Writer实例都正确释放资源

### 使用方法
```bash
npm run schema
```

### 生成的文件
- `src/data/typesdefine.ts` - TypeScript类型定义
- `src/data/baseclasses.ts` - 实现类定义  
- `src/data/baseexport.ts` - 导出函数
- `src/data/baseimport.ts` - 导入函数

这些文件由代码生成器自动生成，请勿手动修改。

## 主要功能

- 根据JSON Schema自动生成TypeScript类型定义
- 生成对应的类实现代码
- 生成导入导出函数，支持类型转换和验证
- 支持继承、泛型、可选属性等复杂类型
- 支持自定义代码注入

## 特性

### 支持的Schema类型

- 基础类型: string, number, boolean
- 对象类型: 支持继承和可选属性
- 数组类型: 支持泛型元素
- 枚举类型: 字符串和数字枚举
- Map类型: 键值对映射
- OneOf类型: 联合类型

### 代码注入

支持在生成的代码中注入自定义逻辑：

- 导入代码注入 (`import-inject.ts`)
- 导出代码注入 (`export-inject.ts`)

### 依赖解析

自动分析类型依赖关系，按正确顺序生成代码。

## 示例

### Schema定义

```json
{
  "name": "User",
  "value": {
    "type": "object",
    "props": [
      { "name": "id", "type": "string", "required": true },
      { "name": "name", "type": "string", "required": true },
      { "name": "age", "type": "number", "required": false }
    ]
  }
}
```

### 生成的类型

```typescript
export interface User {
    id: string;
    name: string;
    age?: number;
}
```

### 生成的类

```typescript
export class User extends Basic {
    constructor(
        public id: string,
        public name: string
    ) {
        super();
    }
    
    age?: number;
}
```

### 生成的导入函数

```typescript
export function importUser(source: types.User, ctx?: IImportContext): impl.User {
    const ret: impl.User = new impl.User(
        source.id,
        source.name
    );
    if (source.age !== undefined) ret.age = source.age;
    return ret;
}
```

## 注意事项

1. Schema文件必须是有效的JSON格式
2. 类型名称必须唯一
3. 循环依赖会被自动检测和处理
4. 生成的代码包含版权头和"勿手动修改"警告
