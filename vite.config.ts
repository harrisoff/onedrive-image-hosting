import { defineConfig, UserConfigExport, loadEnv } from 'vite'
import externalGlobals from "rollup-plugin-external-globals";
import react from '@vitejs/plugin-react'
import { createHtmlPlugin } from 'vite-plugin-html'

const genScripts = ({ VITE_GA_TRACKING_ID, VITE_BAIDU_TRACKING_ID }: Record<string, string>) => {
  let scripts = `
  <script src="https://cdn.jsdelivr.net/npm/axios@0.27.2/dist/axios.min.js" integrity="sha256-43O3ClFnSFxzomVCG8/NH93brknJxRYF5tKRij3krg0=" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js" integrity="sha256-S0lp+k7zWUMk2ixteM6HZvu8L9Eh//OVrt+ZfbCpmgY=" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js" integrity="sha256-IXWO0ITNDjfnNXIu5POVfqlgYoop36bDzhodR6LW5Pc=" crossorigin="anonymous"></script>
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
  const {
    VITE_BASE_URL,
    VITE_GA_TRACKING_ID,
    VITE_BAIDU_TRACKING_ID
  } = loadEnv(mode, process.cwd())
  return defineConfig(
    mode === 'production' ?
      {
        base: VITE_BASE_URL,
        build: {
          rollupOptions: {
            external: ['react', 'react-dom'],
            plugins: [
              // https://github.com/vitejs/vite/issues/4398
              externalGlobals({
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
                injectScript: genScripts({ VITE_GA_TRACKING_ID, VITE_BAIDU_TRACKING_ID })
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
