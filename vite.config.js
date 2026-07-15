import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        blogs: resolve(__dirname, 'blogs/index.html'),
        mcp_postgresql: resolve(__dirname, 'blogs/mcp-postgresql/index.html'),
      },
    },
  },
});
