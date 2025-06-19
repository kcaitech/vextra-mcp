/*
 * Copyright (c) 2023-2025 KCai Technology (https://kcaitech.com). All rights reserved.
 *
 * This file is part of the Vextra project, which is licensed under the AGPL-3.0 license.
 * The full license text can be found in the LICENSE file in the root directory of this source tree.
 *
 * For more information about the AGPL-3.0 license, please visit:
 * https://www.gnu.org/licenses/agpl-3.0.html
 */

import path from 'path';
import { loadSchemas } from "./basic";
import { gen as genTypes } from "./types";
import { gen as genClass } from "./class";
import { gen as genExp } from "./export";

const schemaDir = './src/schema/';
const outputDir = './src/data/simplify/';

const extraOrder = ['GroupShape']; // 因循环引用，无法确定输出顺序。这里将GroupShape 放到最后生成

console.log('📝 开始生成代码...');
console.log(`📂 Schema目录: ${schemaDir}`);
console.log(`📂 输出目录: ${outputDir}`);

try {
    // 加载所有schema文件
    const allNodes = loadSchemas(path.resolve(schemaDir));
    console.log(`✅ 成功加载 ${allNodes.size} 个Schema文件`);

    // 构建输出路径
    const outputPaths = {
        types: path.resolve(outputDir, 'types.ts'),
        classes: path.resolve(outputDir, 'classes.ts'),
        export: path.resolve(outputDir, 'export.ts'),
        import: path.resolve(outputDir, 'import.ts')
    };

    // 生成类型定义
    console.log('🔧 生成类型定义...');
    genTypes(allNodes, outputPaths.types);

    // 生成类定义
    console.log('🔧 生成类定义...');
    genClass(allNodes, outputPaths.classes, {
        typesPath: "./types",
        extraOrder: extraOrder,
    });

    // 生成导出文件
    console.log('🔧 生成导出文件...');
    genExp(allNodes, {
        outputPath: outputPaths.export,
        extraHeader(writer) {
            writer.nl('import { types } from "@kcdesign/data"')
            writer.nl('import * as resultTypes from "./types"')
        },
        namespaces: {
            sourceTypes: 'types.',
            resultTypes: 'resultTypes.'
        }, inject: {
            GroupShape: {
                content: `const ret: resultTypes.GroupShape = exportShape(source, depth) as resultTypes.GroupShape
                    let export_childs = true;
                    if (depth !== undefined) {
                        --depth;
                        if (depth < 0) {
                            export_childs = false;
                        }
                    }
                    if (export_childs) {
                        ret.childs = exportGroupShape_childs(source.childs, depth)
                    }
                    if (source.fixedRadius !== undefined) ret.fixedRadius = source.fixedRadius
                    return ret`
                }
        }
    });

    console.log('🎉 代码生成完成！');

} catch (error) {
    console.error('❌ 代码生成失败:', (error as Error).message);
    if (error instanceof Error && error.stack) {
        console.error('Stack:', error.stack);
    }
    process.exit(1);
}
