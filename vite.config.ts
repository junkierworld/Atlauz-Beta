import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(moduleId) {
            // Vendor chunks for better caching
            if (moduleId.includes('node_modules/motion')) {
              return 'vendor-motion';
            }
            if (moduleId.includes('node_modules/lucide-react')) {
              return 'vendor-lucide';
            }
            if (moduleId.includes('node_modules/@capacitor')) {
              return 'vendor-capacitor';
            }
            if (moduleId.includes('node_modules/@tailwindcss')) {
              return 'vendor-tailwind';
            }
            // Separate large editor components
            if (moduleId.includes('GoogleDocsEditor') ||
                moduleId.includes('PresentationEditor') ||
                moduleId.includes('NotebookViewer') ||
                moduleId.includes('EbookReader') ||
                moduleId.includes('LessonViewer') ||
                moduleId.includes('NotepadViewer') ||
                moduleId.includes('JournalViewer') ||
                moduleId.includes('PdfViewer')) {
              return 'editors';
            }
          }
        }
      }
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    preview: {
      port: 3000,
      host: '0.0.0.0',
    },
  };
});
