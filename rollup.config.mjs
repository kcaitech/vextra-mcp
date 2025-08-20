import typescript from '@rollup/plugin-typescript';
import {babel} from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import clear from 'rollup-plugin-clear';

const external = [
    'express',
    '@kcaitech/vextra-core',
    'zod',
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
    clear({
        targets: ['dist']
    }),
    json(),
    typescript(),
    babel({ babelHelpers: 'bundled' }),
    terser(),
];

export default [
    {
        input: 'src/server.ts',
        output: {
            dir: 'dist',
            format: 'cjs',
            entryFileNames: 'server.js'
        },
        plugins: commonPlugins,
        external
    },
    {
        input: 'src/server_local.ts',
        output: {
            dir: 'dist',
            format: 'cjs',
            entryFileNames: 'server_local.js'
        },
        plugins: commonPlugins,
        external
    }
];
