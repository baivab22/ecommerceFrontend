// import path from 'path'

import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  envPrefix: 'REACT_APP_',
  plugins: [react(), tsconfigPaths({root: '.'})],
  define: {
    'process.env': {}
  },
  // resolve: {
  //   alias: {
  //     src: path.join(__dirname, 'src')
  //   }
  // },
  server: {
    host: true,
    port: 3010,
    proxy: {
      '/api': 'http://localhost:8000'
    }
  }
})