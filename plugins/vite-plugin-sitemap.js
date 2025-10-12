import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getSeoConfig } from "../src/config/seo";

/**
 * Vite plugin to generate sitemap.xml at build time
 * @param {Record<string, string>} env - Environment variables
 * @returns {import('vite').Plugin}
 */
export default function viteSitemapPlugin(env = {}) {
  return {
    name: "vite-plugin-sitemap",
    apply: /** @type {const} */ ("build"), // ビルド時のみ実行
    closeBundle() {
      // 環境変数からSEO設定を取得
      const config = getSeoConfig(env);
      const now = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${config.siteUrl}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const distPath = path.resolve(__dirname, "../dist/sitemap.xml");
      fs.writeFileSync(distPath, sitemap);
      console.log("✓ Generated sitemap.xml");
    },
  };
}
