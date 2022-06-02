import { defineConfig, loadEnv } from 'vite'
import externalGlobals from "rollup-plugin-external-globals";
import react from '@vitejs/plugin-react'
import { createHtmlPlugin } from 'vite-plugin-html'

const genScripts = ({ VITE_GA_TRACKING_ID, VITE_BAIDU_TRACKING_ID }: Record<string, string>) => {
  let scripts = `
  <script src="https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js"></script>
  <script src="https://cdn.bootcdn.net/ajax/libs/react/18.0.0-alpha-6f3fcbd6f-20210730/umd/react.production.min.js"></script>
  <script src="https://cdn.bootcdn.net/ajax/libs/react-dom/18.0.0-alpha-6f3fcbd6f-20210730/umd/react-dom.production.min.js"></script>
  `
  if (VITE_BAIDU_TRACKING_ID) {
    scripts += `
    <script>var _hmt = _hmt || []; (function () { var hm = document.createElement("script"); hm.src = "https://hm.baidu.com/hm.js?${VITE_BAIDU_TRACKING_ID}"; var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(hm, s); })();</script>
    `
  }
  if (VITE_GA_TRACKING_ID) {
    scripts += `
    <script async src="https://www.googletagmanager.com/gtag/js?id=${VITE_GA_TRACKING_ID}"></script>
    <script>window.dataLayer = window.dataLayer || []; function gtag() { dataLayer.push(arguments); } gtag('js', new Date()); gtag('config', '${VITE_GA_TRACKING_ID}');</script>
    `
  }
  return scripts
}

// https://vitejs.dev/config/
// https://github.com/vitejs/vite/issues/1930#issuecomment-783747858
export default ({ mode }) => {
  return defineConfig(
    mode === 'production' ?
      {
        base: '/onedrive-image-hosting',
        build: {
          rollupOptions: {
            plugins: [
              // https://github.com/vitejs/vite/issues/4398
              externalGlobals({
                axios: 'axios',
                react: 'React',
                'react-dom': 'ReactDOM',
              }),
            ],
          }
        },
        plugins: [
          react(),
          createHtmlPlugin({
            inject: {
              data: {
                injectScript: genScripts(loadEnv(mode, process.cwd()))
              }
            }
          })
        ]
      } :
      {
        server: {
          port: 8080,
        },
        plugins: [
          react(),
          createHtmlPlugin({
            inject: {
              data: {
                injectScript: ``
              }
            }
          })
        ],
      }
  )
}
