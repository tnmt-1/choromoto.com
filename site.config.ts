/**
 * サイト全体の設定
 */

// 型定義
export interface SEOConfig {
  title: string;
  description: string;
  author: string;
  siteUrl: string;
  ogImage?: string;
  keywords: string[];
}

export interface SocialConfig {
  twitter: {
    username: string;
  };
  github: {
    username: string;
  };
  bluesky: {
    username: string;
    instance: string;
  };
  mastodon: {
    username: string;
    instance: string;
  };
}

export interface AnalyticsConfig {
  measurementId?: string;
}

export interface ScrapboxConfig {
  projectName: string;
}

export interface SiteConfig {
  seo: SEOConfig;
  social: SocialConfig;
  analytics: AnalyticsConfig;
  scrapbox: ScrapboxConfig;
}

// =============================================================================
// 設定値（ここを編集してください）
// =============================================================================
export const siteConfig: SiteConfig = {
  seo: {
    title: "Choromoto.com",
    description: "Tanimotoのポートフォリオサイト",
    author: "Tanimoto",
    siteUrl: "https://choromoto.com",
    ogImage: "/icon.png",
    keywords: ["portfolio", "web development", "programming"],
  },

  social: {
    twitter: {
      username: "__choromoto",
    },
    github: {
      username: "tnmt-1",
    },
    bluesky: {
      username: "choromoto",
      // ex. bsky.social
      // ハンドルにドメインを利用している場合はドメインを指定する
      instance: "com",
    },
    mastodon: {
      username: "choromoto",
      instance: "fedibird.com",
    },
  },

  analytics: {
    // Google Analyticsを有効にする場合は、ここにMeasurement IDを設定
    // 例: measurementId: "G-XXXXXXXXXX"
    measurementId: "G-4XDGC45SRC",
  },

  scrapbox: {
    projectName: "chorobook",
  },
};
