// ヘッダーコンポーネント
export function renderHeader(): string {
  return `
    <header class="container mx-auto px-6 py-8">
      <div class="text-center">
        <h1 class="text-5xl md:text-7xl font-bold gradient-text mb-4">
          ${import.meta.env.VITE_SITE_TITLE}
        </h1>
      </div>
    </header>
  `;
}
