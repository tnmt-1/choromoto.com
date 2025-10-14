import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Vite plugin to generate sitemap.xml at build time
 * @returns {import('vite').Plugin}
 */
export default function viteSitemapPlugin() {
  return {
    name: "vite-plugin-sitemap",
    apply: /** @type {const} */ ("build"), // ビルド時のみ実行
    async closeBundle() {
      // 設定ファイルから動的にインポート
      const configPath = path.resolve(__dirname, "../site.config.js");
      const { siteConfig } = await import(configPath);
      const now = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteConfig.seo.siteUrl}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

      const distPath = path.resolve(__dirname, "../dist/sitemap.xml");
      fs.writeFileSync(distPath, sitemap);
      console.log("✓ Generated sitemap.xml");
    },
  };
}
