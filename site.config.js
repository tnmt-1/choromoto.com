/**
 * サイト全体の設定
 */

// =============================================================================
// 型定義（JSDocで型情報を提供）
// =============================================================================

/**
 * @typedef {Object} SEOConfig
 * @property {string} title
 * @property {string} description
 * @property {string} author
 * @property {string} siteUrl
 * @property {string} [ogImage]
 * @property {string[]} keywords
 */

/**
 * @typedef {Object} SocialConfig
 * @property {{ username: string }} twitter
 * @property {{ username: string }} github
 * @property {{ username: string, instance: string }} bluesky
 * @property {{ username: string, instance: string }} mastodon
 */

/**
 * @typedef {Object} AnalyticsConfig
 * @property {string} [measurementId]
 */

/**
 * @typedef {Object} ScrapboxConfig
 * @property {string} projectName
 * @property {Object} api
 * @property {"updated"|"created"|"accessed"|"linked"|"views"|"title"|"updatedbyMe"} api.sort - ソート方法
 * @property {number} api.skip - 何番目のページから取得するかを指定する
 * @property {number} api.limit - 取得するページ情報の最大数（範囲：1~1000）
 */

/**
 * @typedef {Object} SiteConfig
 * @property {SEOConfig} seo
 * @property {SocialConfig} social
 * @property {AnalyticsConfig} analytics
 * @property {ScrapboxConfig} scrapbox
 */

// =============================================================================
// 設定値（ここを編集してください）
// =============================================================================

/** @type {SiteConfig} */
export const siteConfig = {
  seo: {
    title: "choromoto.com",
    description: "choromotoのポートフォリオサイト",
    author: "choromoto",
    siteUrl: "https://choromoto.com/",
    ogImage: "/favicon.ico",
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
    api: {
      sort: "updated",
      skip: 3,
      limit: 5
    },
  },
};
