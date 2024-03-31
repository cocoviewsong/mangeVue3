import { fileURLToPath, URL } from 'node:url';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import { viteMockServe } from 'vite-plugin-mock';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        // 指定 SVG图标 保存的文件夹路径
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // 指定 使用svg图标的格式
        symbolId: 'icon-[dir]-[name]',
        // 指定要生成的组件名称
        // svgsDir: 'src/svgs',
      }),
      viteMockServe({
        localEnabled: command === 'serve', // 保证开发阶段使用mock接口
      }),
    ],

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    // scss 全局变量的配置
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "./src/styles/variable.scss";',
        },
      },
    },
  };
});
