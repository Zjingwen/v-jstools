import { PluginOption, build } from 'vite';
import chokidar from 'chokidar';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import replace from 'vite-plugin-filter-replace';

const outDir = resolve(__dirname, '../dist');
let gMode: string = undefined;
let gAlias: Object = undefined;

/**
 * build配置
 * @param key 文件名
 * @param value 文件路径
 */
async function handleBuild(key, value, alias) {
  await build({
    plugins: [
      react(),
      replace([
        {
          filter: ['node_modules/antd/dist/reset.css'],
          replace() {
            // 去除影响全局的css
            return "";
          },
        }
      ]),
      cssInjectedByJsPlugin({
      }),
    ],
    resolve: {
      alias,
    },
    build: {
      chunkSizeWarningLimit: 2048,
      outDir,
      emptyOutDir: false,
      cssCodeSplit: false,
      modulePreload: false,
      rollupOptions: {
        input: {
          [key]: value,
        },
        output: {
          entryFileNames: '[name].js',
        },
        onwarn(warning, warn) {
          if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
            return;
          }
          warn(warning);
        },
      },
    },
    configFile: false,
  });
}

/**
 * 启动watch模式
 */
async function handleWatch(packages, alias) {
  const packagesObject = Object.keys(packages)
  const filePath = packagesObject.map(v => `${resolve()}/src/${v}/`);
  const watcher = chokidar.watch(filePath, {
    persistent: true,
    interval: 1000,
    binaryInterval: 3000,
    awaitWriteFinish: {
      pollInterval: 3000,
      stabilityThreshold: 3000,
    }
  });
  watcher.on('all', async (event, path) => {
    if (event) console.error(`file ${path} changed size to ${event}`);

    if ('change' !== event) return;
    const item = packagesObject.findIndex(v => path.indexOf(v) > -1);
    if (item === -1) return console.error(`Package not found for path: ${path}`);

    const argName = packagesObject[item];
    const argFile = packages[argName];
    await handleBuild(argName, argFile, alias);
  })
  watcher.on('error', error => console.log(`Watcher error: ${error}`));
}

export default function buildScript(packages): PluginOption {
  return {
    name: 'build-Script',
    configResolved: (resolveConfig: {
      mode: string,
      resolve: { alias: object },
      build: { rollupOptions: any }
    }): void => {
      const { mode, resolve: { alias } } = resolveConfig;
      gAlias = alias;
      gMode = mode;
    },
    buildEnd: async () => {
      if (gMode === 'development') {
        await handleWatch(packages, gAlias);
      }
      if (gMode === 'production') {
        for (const i in packages) {
          const p = packages[i];
          await handleBuild(i, p, gAlias);
          console.log('[code build sucessfully success]', i);
        }
      }
      console.log('code buildEnd');
    },
  };
}