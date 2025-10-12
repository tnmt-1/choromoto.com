/**
 * Vite plugin to inject Google Analytics at build time
 * @param {Record<string, string>} env - Environment variables
 * @returns {import('vite').Plugin}
 */
export default function viteGoogleAnalyticsPlugin(env = {}) {
  return {
    name: "vite-plugin-google-analytics",
    transformIndexHtml: {
      order: /** @type {'pre'} */ ("pre"),
      handler(html) {
        const gaId = env.VITE_GA_MEASUREMENT_ID;

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
