import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import {createSvgIconsPlugin} from 'vite-plugin-svg-icons'
import path from 'path'
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';


// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
    const env = loadEnv(mode, process.cwd())

    return {
        envDir: './src',
        envPrefix: 'VITE_APP_',
        base: '/',
        server: {
            host: '0.0.0.0',
            port: '7700',
            proxy: {
                '/api': {
                    target: process.env.VITE_APP_BASE_API,
                    changeOrigin: true,
                    rewrite: path => path.replace(/^\/api/, '') // 重写 api 为 空，就是去掉它
                }
            },
            //https: true,
        },
        plugins: [
            vue(),
            commonjs(),
            resolve(),
            (async () => {
                if (env.NODE_ENV === 'production') {
                    const {default: terser} = await import('@rollup/plugin-terser');
                    return terser();
                }
            })(),
            createSvgIconsPlugin({ // 使用svg图标
                iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],// 指定需要缓存图标的文件夹
                symbolId: 'icon-[dir]-[name]', // 指定symbolId格式
            }),]
        ,
        resolve: {
            alias: {
                '~': path.resolve(__dirname, './'),
                '@': path.resolve('./src'),
            }
        },
        build: {
            rollupOptions: {
                output: {
                    dir: 'dist',
                    format: 'module',
                    chunkFileNames: "js/[name]-[hash].js",
                    entryFileNames: "js/[name]-[hash].js",
                    assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
                },
            },
            minify: "terser",
            terserOptions: {
                // 生产时移除console
                compress: {
                    drop_console: true,
                    drop_debugger: true
                }
            },
            chunkSizeWarningLimit: 2000,
            reportCompressedSize: false,
        },
    }
})