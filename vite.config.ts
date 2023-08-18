import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacyPlugin from '@vitejs/plugin-legacy'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import electron from 'vite-plugin-electron'
import eslintPlugin from 'vite-plugin-eslint'
import path from 'path'

// 是否为开发环境
const isProd = process.env.NODE_ENV === 'production'

// 获取env文件
const getEnvFun = (mode, target) => loadEnv(mode, process.cwd())[target]

// https://vitejs.dev/config/
export default ({ mode }) => defineConfig({
  mode: isProd ? 'production' : 'development',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      _c: path.resolve(__dirname, 'src/components')
    },
    // 导入时想要忽略的扩展名
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  css: {
    postcss: {
      plugins: []
    },
    preprocessorOptions: {
      // 引入全局的less变量
      less: {
        charset: false,
        additionalData: '@import "./src/assets/css/basicVariate.less";',
        javascriptEnabled: true
      }
    }
  },
  json: {
    stringify: true
  },
  // 插件的配置
  plugins: [
    vue(),
    electron({
      entry: 'electron-main/electronMain.ts'
    }),
    eslintPlugin({
      // include: ['src/**/*.js', 'src/**/*.ts', 'src/!**/!*.vue', 'src/!*.js', 'src/!*.vue'],
      include: ['src/**/*.js', 'src/**/*.vue', 'src/**/*.jsx', 'src/**/*.ts'],
      exclude: ['./node_modules/**'],
      cache: false
    }),
    // 按需导入element-plus
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    legacyPlugin({
      targets: ['chrome 76'] // 需要兼容的目标列表，可以设置多个
      // additionalLegacyPolyfills: ['regenerator-runtime/runtime'], // 面向IE11时需要此插件
    })
  ],
  // 开发服务器选项
  server: {
    host: '0.0.0.0',
    port: 7070,
    open: false,
    proxy: {
      '/police': {
        target: getEnvFun(mode, 'VITE_API_URL'),
        changeOrigin: true
      },
      warningws: {
        target: getEnvFun(mode, 'VITE_WS_URL'),
        changeOrigin: true,
        rewrite: path => path.replace(/^\/warningws/, getEnvFun(mode, 'VITE_WS_REWRITE'))
      }
    }
  }
})
