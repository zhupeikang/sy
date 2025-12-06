import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import pxtovw from 'postcss-px-to-viewport';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';
import UnoCSS from 'unocss/vite'

const loader = pxtovw({
  //这里是设计稿宽度 自己修改
  viewportWidth: 750,
  selectorBlackList: ['.ignore', '.hairlines', 'ignore', '#app', '.van-tabbar--fixed'],
  exclude: /([\/\\])(node_modules)([\/\\])/,
})
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    css: {
      postcss: {
        plugins: [loader],
      }
    },
    plugins: [
      UnoCSS(),
      VueSetupExtend(),
      vue(),
      Components({
        resolvers: [VantResolver()],
      }),
      ViteEjsPlugin({
        title: env.VITE_APP_TITLE,
        maskid: env.VITE_51LA_MASK
      })
    ],
    server: {
      host: true,
      port: 80,
      hmr: {
        overlay: false
      },
    },
    resolve: {
      // ↓路径别名，主要是这部分
      alias: {
        "@": resolve(__dirname, "./src")
      }
    },
    build: {
      minify: 'terser',
      outDir: env.VITE_OUT_DIR || 'dist',
      sourcemap: env.VITE_SOURCEMAP === 'true' ? 'inline' : false,
      terserOptions: {
        compress: {
          drop_debugger: env.VITE_DROP_DEBUGGER === 'true',
          drop_console: env.VITE_DROP_CONSOLE === 'true'
        }
      }
    },
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'axios',
      ]
    }
  }
})
