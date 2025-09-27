import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 🔑 Alias que apunta al fichero JS generado en la build personalizada
      '@ckeditor-custom/ckeditor': resolve(
        __dirname,
        '../../custom-ckeditor-build/build/ckeditor.js'
      )
    }
  }
})