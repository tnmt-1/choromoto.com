import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import viteGoogleAnalyticsPlugin from "./plugins/vite-plugin-google-analytics.js";
import viteMetaPlugin from "./plugins/vite-plugin-meta.js";
import { scrapboxDataPlugin } from "./plugins/vite-plugin-scrapbox.js";
import viteSitemapPlugin from "./plugins/vite-plugin-sitemap.js";

export default defineConfig(({ mode }) => {
  // 環境変数を読み込む
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      tailwindcss(),
      scrapboxDataPlugin(env),
      viteMetaPlugin(env),
      viteGoogleAnalyticsPlugin(env),
      viteSitemapPlugin(env),
    ],
  };
});
