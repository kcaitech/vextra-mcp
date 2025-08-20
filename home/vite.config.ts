import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { createHtmlPlugin } from 'vite-plugin-html';
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    return {
        base: env.VITE_BASE_URL,
        plugins: [
            vue(),
            createHtmlPlugin({
                minify: true,
                template: 'public/index.html',
                entry: '/src/main.ts',
            }),],
        resolve: {
            alias: {
                '@': resolve(__dirname, 'src'),
            },
        },
        build: {
            outDir: 'dist',
            assetsDir: 'assets',
            rollupOptions: {
                //   input: {
                //     main: resolve(__dirname, 'index.html'),
                //   },
            },
        },
        server: {
            port: 3000,
            open: true,
        },
    }
}) 