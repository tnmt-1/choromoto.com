/**
 * サイト全体の設定の型定義
 */

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
  api: {
    /** ソート方法 */
    sort: "updated" | "created" | "accessed" | "linked" | "views" | "title" | "updatedbyMe";
    /** 何番目のページから取得するかを指定する */
    skip: number;
    /** 取得するページ情報の最大数（範囲：1~1000） */
    limit: number;
  };
}

export interface SiteConfig {
  seo: SEOConfig;
  social: SocialConfig;
  analytics: AnalyticsConfig;
  scrapbox: ScrapboxConfig;
}

export declare const siteConfig: SiteConfig;
