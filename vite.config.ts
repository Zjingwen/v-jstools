import { resolve } from 'path'
import { defineConfig } from 'vite'

import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

import createManifest from './plugins/vite-plugin-create-manifest';
import buildScript from './plugins/vite-extension-build-script';

import manifest from './src/manifest';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    cssInjectedByJsPlugin({
      jsAssetsFilterFunction: function (outputChunk: { fileName: string }) {
        // 定义常量存储文件名
        // const JS_ASSETS_FILENAMES = ["popup.js", "options.js", "devtools.js", "panel.js"];
        const JS_ASSETS_FILENAMES = ["popup.js", "options.js"];
        return JS_ASSETS_FILENAMES.includes(outputChunk.fileName);
      },
    }),
    createManifest(manifest),
    buildScript({
      serviceWorker: resolve(__dirname, 'src/serviceWorker/index.js'),
      contentScripts: resolve(__dirname, 'src/contentScripts/index.js'),
      // injectedScripts: resolve(__dirname, 'src/injectedScripts/index.js'),
    }),
  ],
  resolve: {
    alias: {
      '@src': '/src',
      // '@utils': '/utils.js',
      // '@font': '/font',
      // '@submodule': "/submodule",
      // '@popup': '/src/popup',
    }
  },
  build: {
    chunkSizeWarningLimit: 2048,
    cssCodeSplit: false,
    modulePreload: false,
    emptyOutDir: false,// 禁止产出的时候清空文件夹
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
      },
      onwarn(warning, warn) {
        /**
         * Suppress "Module level directives cause errors when bundled" warnings
         * 取消“捆绑时模块级指令导致错误”警告
         */
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
          return;
        }
        warn(warning);
      },
      input: {
        popup: resolve('src/popup/index.html'),
        options: resolve('src/options/index.html'),
        // devtools: resolve('src/devtools/index.html'),
        // panel: resolve('src/panel/index.html'),
      },
    }
  },
})
