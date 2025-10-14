import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Vite plugin to inject SEO meta tags at build time
 * @returns {import('vite').Plugin}
 */
export default function viteMetaPlugin() {
  return {
    name: "vite-plugin-meta",
    transformIndexHtml: {
      order: /** @type {'pre'} */ ("pre"),
      async handler(html) {
        // 設定ファイルから動的にインポート
        const configPath = resolve(__dirname, "../site.config.js");
        const { siteConfig } = await import(configPath);

        // Twitterハンドルの整形
        const twitterHandle = `@${siteConfig.social.twitter.username}`;

        // OGP画像のフルURLを生成
        const ogImageUrl = siteConfig.seo.ogImage
          ? `${siteConfig.seo.siteUrl}${siteConfig.seo.ogImage}`
          : `${siteConfig.seo.siteUrl}/icon.png`;

        // メタタグを生成
        const metaTags = `
    <!-- Title & Description -->
    <title>${siteConfig.seo.title}</title>
    <meta name="description" content="${siteConfig.seo.description}" />
    <meta name="keywords" content="${siteConfig.seo.keywords.join(",")}" />
    <meta name="author" content="${siteConfig.seo.author}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${siteConfig.seo.siteUrl}/" />
    <meta property="og:title" content="${siteConfig.seo.title}" />
    <meta property="og:description" content="${siteConfig.seo.description}" />
    <meta property="og:image" content="${ogImageUrl}" />
    <meta property="og:site_name" content="${siteConfig.seo.author}" />
    <meta property="og:locale" content="ja_JP" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="${twitterHandle}" />
    <meta name="twitter:creator" content="${twitterHandle}" />
    <meta name="twitter:title" content="${siteConfig.seo.title}" />
    <meta name="twitter:description" content="${siteConfig.seo.description}" />
    <meta name="twitter:image" content="${ogImageUrl}" />

    <!-- Canonical URL -->
    <link rel="canonical" href="${siteConfig.seo.siteUrl}/" />

    <!-- Robots -->
    <meta name="robots" content="index, follow" />
`;

        // コメントの後にメタタグを挿入
        return html.replace(
          /<!-- SEO tags will be injected by vite-plugin-html -->/,
          metaTags,
        );
      },
    },
  };
}
