import typescript from '@rollup/plugin-typescript';
import {babel} from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import clear from 'rollup-plugin-clear';

export default [{
    input: 'src/app.ts',
    output: [
        {
            dir: 'dist',
            format: 'es',
            entryFileNames: 'index.js'
        },
        {
            dir: 'dist',
            format: 'cjs',
            entryFileNames: 'index.cjs'
        }
    ],
    plugins: [
        clear({
            targets: ['dist']
        }),
        json(),
        typescript(),
        babel({ babelHelpers: 'bundled' }),
        terser(),
    ],
    external: [
        'express',
        'winston',
        'axios',
        'qs',
        '@kcdesign/text2path',
        '@kcdesign/data',
        '@aws-sdk/client-s3',
        'ali-oss',
        'zod',
        'uuid',
        'dotenv',
        '@kcdesign/kcserver-client'
    ]
}];
