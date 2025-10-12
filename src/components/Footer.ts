// フッターコンポーネント
export function renderFooter(): string {
  const currentYear = new Date().getFullYear();

  return `
    <footer class="bg-white shadow-lg mt-16">
      <div class="container mx-auto px-6 py-8">
        <div class="text-center text-gray-600">
          <p>&copy; ${currentYear} choromoto.com. All rights reserved.</p>
          <p class="mt-2 text-sm">Built with ❤️ using Vite + TypeScript + Tailwind CSS</p>
        </div>
      </div>
    </footer>
  `;
}
