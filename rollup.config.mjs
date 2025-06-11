import typescript from '@rollup/plugin-typescript';
import {babel} from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import clear from 'rollup-plugin-clear';

const external = [
    'express',
    'winston',
    'axios',
    'qs',
    '@kcaitech/text2path',
    '@kcdesign/data',
    '@aws-sdk/client-s3',
    'ali-oss',
    'zod',
    'uuid',
    '@kcdesign/kcserver-client'
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
            file: 'dist/server.js',
            format: 'cjs',
        },
        plugins: commonPlugins,
        external
    }
];
