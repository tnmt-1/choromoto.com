// SNSリンクの設定
export interface SocialLink {
  name: string;
  url: string;
  icon: string; // Iconifyのアイコン名 (例: "mdi:twitter")
  bgColor: string;
  hoverColor: string;
}

// 環境変数から取得（デフォルト値付き）
const twitterUsername =
  import.meta.env.VITE_TWITTER_USERNAME || "your_username";
const githubUsername = import.meta.env.VITE_GITHUB_USERNAME || "your_username";
const blueskyInstance = import.meta.env.VITE_BLUESKY_INSTANCE || "bsky.social";
const blueskyUsername =
  import.meta.env.VITE_BLUESKY_USERNAME || "your_username";
const mastodonInstance =
  import.meta.env.VITE_MASTODON_INSTANCE || "mastodon.social";
const mastodonUsername =
  import.meta.env.VITE_MASTODON_USERNAME || "your_username";

export const socialLinks: SocialLink[] = [
  {
    name: "Twitter",
    url: `https://twitter.com/${twitterUsername}`,
    icon: "mdi:twitter",
    bgColor: "bg-blue-500",
    hoverColor: "hover:bg-blue-600",
  },
  {
    name: "GitHub",
    url: `https://github.com/${githubUsername}`,
    icon: "mdi:github",
    bgColor: "bg-gray-800",
    hoverColor: "hover:bg-gray-900",
  },
  {
    name: "Bluesky",
    url: `https://bsky.app/profile/${blueskyUsername}.${blueskyInstance}`,
    icon: "simple-icons:bluesky",
    bgColor: "bg-sky-500",
    hoverColor: "hover:bg-sky-600",
  },
  {
    name: "Mastodon",
    url: `https://${mastodonInstance}/@${mastodonUsername}`,
    icon: "mdi:mastodon",
    bgColor: "bg-purple-600",
    hoverColor: "hover:bg-purple-700",
  },
];
