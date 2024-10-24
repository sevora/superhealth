import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  /**
   * This is for development, in order for it to use the actual onnxruntime-web
   * which has all the files necessary and not use .vite/deps folder.
   */
  optimizeDeps: { exclude: ['onnxruntime-web'] },
  plugins: [
    react(),
    
    /**
     * This is for production, so that every file in onnxruntime-web is included
     * in the assets of the distribution directory.
     */
    viteStaticCopy({ targets: [{ src: './node_modules/onnxruntime-web/dist/*.*', dest: './assets/' }] }),
  ],
})
