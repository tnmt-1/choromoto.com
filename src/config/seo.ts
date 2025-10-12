// SEO設定
export interface SEOConfig {
  title: string;
  description: string;
  author: string;
  siteUrl: string;
  ogImage?: string;
  twitterHandle?: string;
  keywords: string[];
}

// デフォルト値（.envで上書き可能）
export const seoConfig: SEOConfig = {
  title: "your site title",
  description: "your site description",
  author: "your name",
  siteUrl: "https://example.com",
  ogImage: "/icon.png",
  twitterHandle: "@your_username",
  keywords: [],
};

/**
 * 環境変数からSEO設定を取得する
 * @param env - 環境変数オブジェクト
 */
export function getSeoConfig(env: Record<string, string> = {}): SEOConfig {
  return {
    title: env.VITE_SITE_TITLE || seoConfig.title,
    description: env.VITE_SITE_DESCRIPTION || seoConfig.description,
    author: env.VITE_SITE_AUTHOR || seoConfig.author,
    siteUrl: env.VITE_SITE_URL || seoConfig.siteUrl,
    ogImage: env.VITE_OG_IMAGE || seoConfig.ogImage,
    twitterHandle: env.VITE_TWITTER_USERNAME || seoConfig.twitterHandle,
    keywords: env.VITE_SITE_KEYWORDS
      ? env.VITE_SITE_KEYWORDS.split(",").map((k) => k.trim())
      : seoConfig.keywords,
  };
}
