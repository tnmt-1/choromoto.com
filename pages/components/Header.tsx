import { siteConfig } from "../../site.config";

// ヘッダーコンポーネント
export function Header() {
  return (
    <header className="container mx-auto px-6 py-8">
      <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-4">
          {siteConfig.seo.title}
        </h1>
      </div>
    </header>
  );
}
