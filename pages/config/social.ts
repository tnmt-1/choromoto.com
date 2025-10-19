import { siteConfig } from "@/site.config";

// SNSリンクの設定
export interface SocialLink {
  name: string;
  url: string;
  icon: string; // Iconifyのアイコン名 (例: "mdi:twitter")
  bgColor: string;
  hoverColor: string;
}

export const socialLinks: SocialLink[] = [
  {
    name: "Twitter",
    url: `https://twitter.com/${siteConfig.social.twitter.username}`,
    icon: "mdi:twitter",
    bgColor: "bg-blue-500",
    hoverColor: "hover:bg-blue-600",
  },
  {
    name: "GitHub",
    url: `https://github.com/${siteConfig.social.github.username}`,
    icon: "mdi:github",
    bgColor: "bg-gray-800",
    hoverColor: "hover:bg-gray-900",
  },
  {
    name: "Bluesky",
    url: `https://bsky.app/profile/${siteConfig.social.bluesky.username}.${siteConfig.social.bluesky.instance}`,
    icon: "simple-icons:bluesky",
    bgColor: "bg-sky-500",
    hoverColor: "hover:bg-sky-600",
  },
  {
    name: "Mastodon",
    url: `https://${siteConfig.social.mastodon.instance}/@${siteConfig.social.mastodon.username}`,
    icon: "mdi:mastodon",
    bgColor: "bg-purple-600",
    hoverColor: "hover:bg-purple-700",
  },
];
