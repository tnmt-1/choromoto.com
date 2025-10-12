/// <reference types="vite/client" />

interface ImportMetaEnv {
  // SEO設定
  readonly VITE_SITE_TITLE: string;
  readonly VITE_SITE_DESCRIPTION: string;
  readonly VITE_SITE_AUTHOR: string;
  readonly VITE_SITE_URL: string;
  readonly VITE_OG_IMAGE: string;
  readonly VITE_SITE_KEYWORDS: string;

  // Google Analytics
  readonly VITE_GA_MEASUREMENT_ID: string;

  // Scrapbox
  readonly VITE_SCRAPBOX_PROJECT: string;

  // SNSユーザー名
  readonly VITE_TWITTER_USERNAME: string;
  readonly VITE_GITHUB_USERNAME: string;
  readonly VITE_BLUESKY_USERNAME: string;
  readonly VITE_BLUESKY_INSTANCE: string;
  readonly VITE_MASTODON_USERNAME: string;
  readonly VITE_MASTODON_INSTANCE: string;
}

// biome-ignore lint/correctness/noUnusedVariables:off
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
