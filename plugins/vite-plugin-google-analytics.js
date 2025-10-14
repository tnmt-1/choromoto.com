import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Vite plugin to inject Google Analytics at build time
 * @returns {import('vite').Plugin}
 */
export default function viteGoogleAnalyticsPlugin() {
  return {
    name: "vite-plugin-google-analytics",
    transformIndexHtml: {
      order: /** @type {'pre'} */ ("pre"),
      async handler(html) {
        // 設定ファイルから動的にインポート
        const configPath = resolve(__dirname, "../site.config.ts");
        const { siteConfig } = await import(configPath);
        const gaId = siteConfig.analytics.measurementId;

        // Measurement IDが設定されていない場合はスキップ
        if (!gaId || gaId.trim() === "") {
          return html;
        }

        // Google Analytics (GA4) スクリプトを生成
        const gaScript = `
    <!-- Google Analytics (GA4) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}');
    </script>
`;

        // </head> の直前に挿入
        return html.replace(/<\/head>/, `${gaScript}  </head>`);
      },
    },
  };
}
