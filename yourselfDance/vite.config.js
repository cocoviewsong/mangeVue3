import { fileURLToPath, URL } from 'node:url';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import { viteMockServe } from 'vite-plugin-mock';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 获取各个环境下对应的变量
  let env = loadEnv(mode, process.cwd());

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

    // 代理跨域
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          // 获取数据的服务器地址设置
          target: env.VITE_SERVE,
          // 是否代理跨域
          changeOrigin: true,
          // 路径重写
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
