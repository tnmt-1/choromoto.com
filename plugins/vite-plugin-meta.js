import { getSeoConfig } from "../src/config/seo";

/**
 * Vite plugin to inject SEO meta tags at build time
 * @param {Record<string, string>} env - Environment variables
 * @returns {import('vite').Plugin}
 */
export default function viteMetaPlugin(env = {}) {
  return {
    name: "vite-plugin-meta",
    transformIndexHtml: {
      order: /** @type {'pre'} */ ("pre"),
      handler(html) {
        // 環境変数からSEO設定を取得
        const config = getSeoConfig(env);

        // Twitterハンドルの整形
        let twitterHandle = config.twitterHandle;
        if (twitterHandle && !twitterHandle.startsWith("@")) {
          twitterHandle = `@${twitterHandle}`;
        }

        // OGP画像のフルURLを生成
        const ogImageUrl = config.ogImage
          ? `${config.siteUrl}${config.ogImage}`
          : `${config.siteUrl}/icon.png`;

        // メタタグを生成
        const metaTags = `
    <!-- Title & Description -->
    <title>${config.title}</title>
    <meta name="description" content="${config.description}" />
    <meta name="keywords" content="${config.keywords.join(",")}" />
    <meta name="author" content="${config.author}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${config.siteUrl}/" />
    <meta property="og:title" content="${config.title}" />
    <meta property="og:description" content="${config.description}" />
    <meta property="og:image" content="${ogImageUrl}" />
    <meta property="og:site_name" content="${config.author}" />
    <meta property="og:locale" content="ja_JP" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="${twitterHandle}" />
    <meta name="twitter:creator" content="${twitterHandle}" />
    <meta name="twitter:title" content="${config.title}" />
    <meta name="twitter:description" content="${config.description}" />
    <meta name="twitter:image" content="${ogImageUrl}" />

    <!-- Canonical URL -->
    <link rel="canonical" href="${config.siteUrl}/" />

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
