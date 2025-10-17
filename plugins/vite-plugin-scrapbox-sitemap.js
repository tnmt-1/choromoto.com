import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Scrapbox API からページ情報を取得
 * @param {string} projectName
 * @param {number} initialSkip - 取得開始位置
 * @returns {Promise<{count: number, pages: Array<{title: string, updated: number}>}>}
 */
async function fetchScrapboxPages(projectName, initialSkip = 0) {
  const allPages = [];
  let skip = initialSkip;
  const limit = 1000; // 最大値を使用
  let totalCount = 0;

  try {
    // 最初のリクエストで全体のページ数を取得
    const firstUrl = `https://scrapbox.io/api/pages/${projectName}?limit=${limit}&skip=${skip}`;
    console.log(`Fetching Scrapbox pages: ${firstUrl}`);

    const firstResponse = await fetch(firstUrl);
    if (!firstResponse.ok) {
      throw new Error(`Scrapbox API error: ${firstResponse.status}`);
    }

    const firstData = await firstResponse.json();
    totalCount = firstData.count;
    allPages.push(...firstData.pages);

    console.log(`Total Scrapbox pages: ${totalCount}`);
    console.log(`Fetched: ${allPages.length} pages`);

    // 取得すべき残りのページ数を計算（totalCount - initialSkip - 既に取得したページ数）
    const totalToFetch = totalCount - initialSkip;

    // 残りのページを取得
    while (allPages.length < totalToFetch) {
      skip += limit;

      // サーバーに負荷をかけないように1秒待機
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const url = `https://scrapbox.io/api/pages/${projectName}?limit=${limit}&skip=${skip}`;
      console.log(`Fetching more pages (skip=${skip})...`);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Scrapbox API error: ${response.status}`);
      }

      const data = await response.json();
      allPages.push(...data.pages);
      console.log(`Fetched: ${allPages.length}/${totalToFetch} pages`);
    }

    return {
      count: totalCount,
      pages: allPages,
    };
  } catch (error) {
    console.error("Failed to fetch Scrapbox pages:", error);
    throw error;
  }
}

/**
 * Scrapbox 用のサイトマップとリダイレクトページを生成
 * @returns {import('vite').Plugin}
 */
export default function viteScrapboxSitemapPlugin() {
  return {
    name: "vite-plugin-scrapbox-sitemap",
    apply: /** @type {const} */ ("build"), // ビルド時のみ実行
    async closeBundle() {
      try {
        // 設定ファイルから動的にインポート
        const configPath = path.resolve(__dirname, "../site.config.js");
        const { siteConfig } = await import(configPath);

        const projectName = siteConfig.scrapbox.projectName;
        const initialSkip = siteConfig.scrapbox.api.skip || 0;
        const baseUrl = siteConfig.seo.siteUrl.replace(/\/$/, ""); // 末尾のスラッシュを除去

        console.log(
          `\n📦 Generating Scrapbox sitemap for project: ${projectName}`,
        );

        // Scrapbox API からページ情報を取得
        const { pages } = await fetchScrapboxPages(projectName, initialSkip);

        if (pages.length === 0) {
          console.warn("⚠️  No pages found in Scrapbox project");
          return;
        }

        // サイトマップのエントリを生成
        const urlEntries = pages
          .map((page) => {
            const encodedTitle = encodeURIComponent(page.title);
            // JSTで日付を取得してYYYY-MM-DD形式にフォーマット
            const date = new Date(page.updated * 1000);
            const jstDate = new Date(
              date.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
            );
            const lastmod = jstDate.toISOString().split("T")[0];

            return `  <url>
    <loc>${baseUrl}/scrapbox/${encodedTitle}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
          })
          .join("\n");

        // サイトマップXMLを生成
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

        // dist/scrapbox ディレクトリを作成
        const scrapboxDir = path.resolve(__dirname, "../dist/scrapbox");
        if (!fs.existsSync(scrapboxDir)) {
          fs.mkdirSync(scrapboxDir, { recursive: true });
        }

        // sitemap.xml を生成
        const sitemapPath = path.join(scrapboxDir, "sitemap.xml");
        fs.writeFileSync(sitemapPath, sitemap);
        console.log(`✓ Generated Scrapbox sitemap.xml (${pages.length} pages)`);

        // Cloudflare Pages用の _redirects ファイルを生成
        const distDir = path.resolve(__dirname, "../dist");
        const redirectsPath = path.join(distDir, "_redirects");

        // 各ページのリダイレクトルールを生成
        const redirectRules = pages
          .map((page) => {
            const encodedTitle = encodeURIComponent(page.title);
            return `/scrapbox/${page.title} https://scrapbox.io/${projectName}/${encodedTitle} 308`;
          })
          .join("\n");

        // 既存の _redirects ファイルがあれば読み込む
        let existingRedirects = "";
        if (fs.existsSync(redirectsPath)) {
          existingRedirects = fs.readFileSync(redirectsPath, "utf-8");
          // Scrapboxセクションを削除
          existingRedirects = existingRedirects.replace(
            /# Scrapbox redirects - Auto-generated[\s\S]*?# End Scrapbox redirects\n?/,
            "",
          );
        }

        // 新しい _redirects ファイルを生成
        const redirectsContent = `${`${existingRedirects.trim()}

# Scrapbox redirects - Auto-generated
${redirectRules}
# End Scrapbox redirects
`.trim()}\n`;

        fs.writeFileSync(redirectsPath, redirectsContent);
        console.log(
          `✓ Generated _redirects file (${pages.length} redirect rules)`,
        );
        console.log(`📍 Scrapbox sitemap: ${baseUrl}/scrapbox/sitemap.xml\n`);
      } catch (error) {
        console.error("❌ Failed to generate Scrapbox sitemap:", error);
        throw error;
      }
    },
  };
}
