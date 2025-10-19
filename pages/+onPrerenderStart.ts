import fs from "node:fs";
import path from "node:path";
import { siteConfig } from "@/site.config";

/**
 * Scrapbox APIからページ情報を取得
 */
async function fetchScrapboxPages(
  projectName: string,
  initialSkip = 0
): Promise<{ count: number; pages: Array<{ title: string; updated: number }> }> {
  const allPages: Array<{ title: string; updated: number }> = [];
  let skip = initialSkip;
  const limit = 1000;
  let totalCount = 0;

  try {
    // 最初のリクエスト
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

    // 残りのページを取得
    const totalToFetch = totalCount - initialSkip;
    while (allPages.length < totalToFetch) {
      skip += limit;
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

    return { count: totalCount, pages: allPages };
  } catch (error) {
    console.error("Failed to fetch Scrapbox pages:", error);
    throw error;
  }
}

/**
 * sitemap.xmlを生成
 */
function generateSitemap(): string {
  const now = new Date().toISOString().split("T")[0];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteConfig.seo.siteUrl}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
}

/**
 * Scrapbox用sitemap.xmlを生成
 */
function generateScrapboxSitemap(
  pages: Array<{ title: string; updated: number }>
): string {
  const baseUrl = siteConfig.seo.siteUrl.replace(/\/$/, "");
  const urlEntries = pages
    .map((page) => {
      const encodedTitle = encodeURIComponent(page.title);
      const date = new Date(page.updated * 1000);
      const jstDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
      const lastmod = jstDate.toISOString().split("T")[0];

      return `  <url>
    <loc>${baseUrl}/scrapbox/${encodedTitle}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

/**
 * _redirectsファイルを生成
 */
function generateRedirects(
  pages: Array<{ title: string }>,
  projectName: string
): string {
  const redirectRules = pages
    .map((page) => {
      const encodedTitle = encodeURIComponent(page.title);
      return `/scrapbox/${page.title} https://scrapbox.io/${projectName}/${encodedTitle} 308`;
    })
    .join("\n");

  return `# Scrapbox redirects - Auto-generated
${redirectRules}
# End Scrapbox redirects
`;
}

export default async function onBeforePrerender() {
  console.log("\n🚀 Generating sitemaps...");

  // メインサイトマップを生成
  const sitemap = generateSitemap();
  const distPath = path.resolve(process.cwd(), "dist/client/sitemap.xml");
  fs.writeFileSync(distPath, sitemap);
  console.log("✓ Generated sitemap.xml");

  // Scrapboxサイトマップを生成
  try {
    const projectName = siteConfig.scrapbox.projectName;
    const initialSkip = siteConfig.scrapbox.api.skip || 0;

    console.log(`\n📦 Generating Scrapbox sitemap for project: ${projectName}`);

    const { pages } = await fetchScrapboxPages(projectName, initialSkip);

    if (pages.length === 0) {
      console.warn("⚠️  No pages found in Scrapbox project");
      return;
    }

    // dist/client/scrapboxディレクトリを作成
    const scrapboxDir = path.resolve(process.cwd(), "dist/client/scrapbox");
    if (!fs.existsSync(scrapboxDir)) {
      fs.mkdirSync(scrapboxDir, { recursive: true });
    }

    // Scrapbox sitemap.xmlを生成
    const scrapboxSitemap = generateScrapboxSitemap(pages);
    const sitemapPath = path.join(scrapboxDir, "sitemap.xml");
    fs.writeFileSync(sitemapPath, scrapboxSitemap);
    console.log(`✓ Generated Scrapbox sitemap.xml (${pages.length} pages)`);

    // _redirectsファイルを生成
    const redirects = generateRedirects(pages, projectName);
    const redirectsPath = path.resolve(process.cwd(), "dist/client/_redirects");
    fs.writeFileSync(redirectsPath, redirects);
    console.log(`✓ Generated _redirects file (${pages.length} redirect rules)`);
    console.log(`📍 Scrapbox sitemap: ${siteConfig.seo.siteUrl}/scrapbox/sitemap.xml\n`);
  } catch (error) {
    console.error("❌ Failed to generate Scrapbox sitemap:", error);
    throw error;
  }
}
