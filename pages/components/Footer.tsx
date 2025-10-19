// フッターコンポーネント
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white shadow-lg mt-16">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center text-gray-600">
          <p>&copy; {currentYear} choromoto.com. All rights reserved.</p>
          <p className="mt-2 text-sm">Built with ❤️ using Vite + TypeScript + Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}
