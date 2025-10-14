import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import viteGoogleAnalyticsPlugin from "./plugins/vite-plugin-google-analytics.js";
import viteMetaPlugin from "./plugins/vite-plugin-meta.js";
import { scrapboxDataPlugin } from "./plugins/vite-plugin-scrapbox.js";
import viteSitemapPlugin from "./plugins/vite-plugin-sitemap.js";

export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL(".", import.meta.url)),
      },
    },
    plugins: [
      tailwindcss(),
      scrapboxDataPlugin(),
      viteMetaPlugin(),
      viteGoogleAnalyticsPlugin(),
      viteSitemapPlugin(),
    ],
  };
});
