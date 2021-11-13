import { defineConfig, UserConfigExport } from 'vite'
import externalGlobals from "rollup-plugin-external-globals";
import react from '@vitejs/plugin-react'
import template from 'vite-plugin-template'

// https://vitejs.dev/config/
// https://github.com/vitejs/vite/issues/1930#issuecomment-783747858
export default ({ mode }) => {
  const developmentConfig: UserConfigExport = {
    server: {
      port: 8080,
    },
    plugins: [
      react(),
      template({
        template: 'index.html'
      }),
    ],
  }
  const productionConfig: UserConfigExport = {
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
      template({
        template: 'index.prod.html'
      })
    ]
  }
  const config = mode === 'production' ? productionConfig : developmentConfig

  return defineConfig(config)
}
