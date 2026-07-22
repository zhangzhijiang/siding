import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // Use '/siding/' for GitHub Pages web deployment, '/' for Android/iOS builds
    // When mode is 'android', use '/' base path
    const base = mode === 'android' ? '/' : '/siding/';
    
    return {
      base,
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
      ],
      build: {
        cssCodeSplit: false,
        rollupOptions: {
          output: {
            manualChunks: undefined,
          },
        },
        // Disable CSS minification to avoid processing issues
        cssMinify: false,
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
