import { defineConfig ,loadEnv } from 'vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import vue from '@vitejs/plugin-vue'
// import { resolve } from 'path';
import path  from 'path';
// https://vitejs.dev/config/



export default defineConfig(({ command, mode, ssrBuild }) =>
{
  
  const { VITE_APP_MODE ,VITE_APP_OUTDIR,VITE_APP_SERVICE_URL} = loadEnv( mode, '' );
  console.log('访问API地址',VITE_APP_OUTDIR,VITE_APP_SERVICE_URL)
  return {
    plugins : [ vue(), Components({
      resolvers: [AntDesignVueResolver()]
    })] ,
    
    resolve: {
      // alias: {
      //   '@': resolve(__dirname, 'src') // 设置 `@` 指向 `src` 目录
      //
      // }
      alias:[
        { find: /^@\//, replacement: `${path.resolve(__dirname, './src')}/` },
      ],
    },
    server : {
      open : true , //项目启动时自动打开浏览器
      port : 8888 , //自定义端口
      hmr : true , //开启热加载
      proxy: { // 本地开发环境通过代理实现跨域，生产环境使用 nginx 转发
        // 正则表达式写法
        '^/api': {
          target:  'http://localhost:8866', // 后端服务实际地址
          changeOrigin: true, //开启代理
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api')
        }
      }
    } ,
    build : {
      outDir : VITE_APP_OUTDIR , // 输出文件目录  测试环境为test  正式为dist
    }
  }
})
