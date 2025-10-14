import { siteConfig } from "@/site.config";

// ヘッダーコンポーネント
export function renderHeader(): string {
  return `
    <header class="container mx-auto px-6 py-8">
      <div class="text-center">
        <h1 class="text-5xl md:text-7xl font-bold gradient-text mb-4">
          ${siteConfig.seo.title}
        </h1>
      </div>
    </header>
  `;
}
