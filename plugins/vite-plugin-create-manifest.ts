import { PluginOption } from "vite";
import { resolve } from 'path';
import { readFileSync } from "fs";
import { writeFileSync, existsSync, copyFileSync, mkdirSync } from 'fs';

/**
 * 根据传入的manifest配置，在dist中产出manifest.json文件
 * @param manifest 浏览器插件配置
 * @returns 
 */
export default function createManifest(manifest): PluginOption {
  return {
    name: "vite-plugin-extensions-manifest",
    config: async (config) => {
      const { mode } = config;
      if (mode === 'production') {
        // 判断manifest文件中是否有icons
        if (manifest.hasOwnProperty('icons')) {
          const p = resolve(); // 根目录
          const pathICons = `${resolve()}/icons`;// 项目目录icons文件路径
          const distICons = `${resolve()}/dist/icons`; // dist中icons文件路径
          const notICons = existsSync(pathICons); // 判断根目录下文件是否存在
          const notDistICons = existsSync(distICons); // 判断dist目录下文件是否存在

          if (notICons) {
            !notDistICons && await mkdirSync(distICons); //不存在就创建文件夹
            for (let i in manifest.icons) {
              const file = manifest.icons[i];
              await copyFileSync(`${p}/${file}`, `${p}/dist/${file}`);
              console.log(`[${pathICons}/${file}]: success`);
            }
          } else {
            console.log(`[vite-plugin-extensions-manifest]: icons 文件夹不存在;`)
          }
        }

        // 读写manifest文件，并且写入到dist中
        // 判断根目录manifest文件和dist/manifest文件是否相等
        const manifestPath = `${resolve()}/dist/manifest.json`;
        // 判断dist/manifest.json文件是否存在
        const notManifest = await existsSync(manifestPath);

        // 存在执行判断
        if (notManifest) {
          const oldManifest = JSON.stringify(JSON.parse(readFileSync(manifestPath, 'utf-8'))); // dist下的manifest文件;
          const newManifest = JSON.stringify(manifest);
          const diffManifest = oldManifest === newManifest ? true : false;
          if (!diffManifest) {
            await writeFileSync(
              manifestPath,
              JSON.stringify(manifest, null, 2),
              { 'flag': 'w' }
            );
            console.log('[vite-plugin-extensions-manifest]: change dist/manifest.json success;')
          }
        } else {
          // 不存在直接新建
          await writeFileSync(
            manifestPath,
            JSON.stringify(manifest, null, 2),
            { 'flag': 'w' }
          );
          console.log('[vite-plugin-extensions-manifest]: create dist/manifest.json success;')
        }
      }
    },
  };
}