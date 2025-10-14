import { siteConfig } from "@/site.config";

// SEO設定（site.config.js からエクスポート）
export type { SEOConfig } from "@/site.config";

// デフォルトのSEO設定をエクスポート
export const seoConfig = siteConfig.seo;
