import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        svgo: false,
      },
    }),
  ],
  publicDir: 'public',
  root: '.',
  resolve: {
    alias: {
      'app': path.resolve(__dirname, 'src/app'),
      'features': path.resolve(__dirname, 'src/features'),
      'entities': path.resolve(__dirname, 'src/entities'),
      'pages': path.resolve(__dirname, 'src/pages'),
      'shared': path.resolve(__dirname, 'src/shared'),
      'widgets': path.resolve(__dirname, 'src/widgets'),
    },
  },
});
