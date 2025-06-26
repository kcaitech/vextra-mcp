import typescript from '@rollup/plugin-typescript';
import {babel} from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import clear from 'rollup-plugin-clear';

const external = [
    'express',
    '@kcdesign/data',
    '@aws-sdk/client-s3',
    'ali-oss',
    'zod',
    '@kcdesign/kcserver-client',
    'skia-canvas',
    '@modelcontextprotocol/sdk',
    '@modelcontextprotocol/sdk/server/sse.js',
    '@modelcontextprotocol/sdk/server/stdio.js',
    '@modelcontextprotocol/sdk/server/mcp.js',
    'js-yaml',
    'yargs',
    'fs',
    'path',
];

const commonPlugins = [
    json(),
    typescript(),
    babel({ babelHelpers: 'bundled' }),
    terser(),
];

export default [
    // npm 包构建配置
    {
        input: 'src/index.ts',
        output: [
            {
                dir: 'dist',
                format: 'es',
                entryFileNames: '[name].js'
            },
            {
                dir: 'dist',
                format: 'cjs',
                entryFileNames: '[name].cjs'
            }
        ],
        plugins: [
            clear({
                targets: ['dist']
            }),
            ...commonPlugins
        ],
        external
    },
    // 服务器构建配置
    {
        input: 'src/server.ts',
        output: {
            dir: 'dist',
            format: 'cjs',
            entryFileNames: 'server.js'
        },
        plugins: commonPlugins,
        external
    }
];
