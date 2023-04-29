import { resolve, dirname } from "path";
import { defineConfig } from "vite";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  define: {
    "process.env": { NODE_ENV: "production" },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/ui/index.tsx"),
      name: "Index",
      fileName: "index",
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
      },
    },
  },
});
