import ReactDOMServer from "react-dom/server";
import { dangerouslySkipEscape, escapeInject } from "vike/server";
import type { OnRenderHtmlAsync } from "vike/types";
import { siteConfig } from "@/site.config";
import type { Data } from "./+data";
import Page from "./+Page";
import "../src/style.css";

// Google Analyticsコンポーネント
function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} />
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for Google Analytics initialization
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}');
          `,
        }}
      />
    </>
  );
}

// HTMLドキュメント全体のコンポーネント
function HtmlDocument({ children }: { children: React.ReactNode }) {
  const { seo, analytics, social } = siteConfig;
  const ogImageUrl = seo.ogImage?.startsWith("http")
    ? seo.ogImage
    : `${seo.siteUrl}${seo.ogImage || "icon.png"}`;

  return (
    <html lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/png" href="/icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={seo.description} />
        <meta name="author" content={seo.author} />
        <meta name="keywords" content={seo.keywords.join(", ")} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:url" content={seo.siteUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content={`@${social.twitter.username}`} />
        <title>{seo.title}</title>

        {/* Iconify Web Component (CDN) */}
        <script
          type="module"
          src="https://cdn.jsdelivr.net/npm/iconify-icon@2.2.0/dist/iconify-icon.min.js"
        />

        {analytics.measurementId && (
          <GoogleAnalytics measurementId={analytics.measurementId} />
        )}
      </head>
      <body>
        {/* biome-ignore lint/correctness/useUniqueElementIds: Static HTML generation - single root element is intentional */}
        <div id="root">{children}</div>
      </body>
    </html>
  );
}

const onRenderHtml: OnRenderHtmlAsync = async (
  pageContext,
): ReturnType<OnRenderHtmlAsync> => {
  const { data } = pageContext as { data: Data };

  // ReactコンポーネントをHTMLに変換（サーバー側のみ）
  const pageHtml = ReactDOMServer.renderToString(<Page data={data} />);

  // HTML全体をReactコンポーネントとして生成
  const documentHtml = ReactDOMServer.renderToStaticMarkup(
    <HtmlDocument>
      {/** biome-ignore lint/security/noDangerouslySetInnerHtml: Server-side rendering requires innerHTML */}
      <div dangerouslySetInnerHTML={{ __html: pageHtml }} />
    </HtmlDocument>
  );

  // Vikeが期待する形式で返す（DOCTYPEを追加）
  return escapeInject`<!DOCTYPE html>${dangerouslySkipEscape(documentHtml)}`;
};

export { onRenderHtml };