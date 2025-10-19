import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import vike from "vike/plugin";
import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL(".", import.meta.url)),
      },
    },
    plugins: [
      vike({ prerender: true }),
      tailwindcss(),
    ],
  };
});
