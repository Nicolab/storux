import { defineConfig } from "vite";
import commonjs from '@rollup/plugin-commonjs';
import path from 'path';

export default defineConfig({
  plugins: [commonjs()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'storux'
    },
    rollupOptions: {
      output: {
      }
    }
  }
});
