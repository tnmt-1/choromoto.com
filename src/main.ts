import "./style.css";
import "iconify-icon";
import {
  renderAbout,
  renderFooter,
  renderHeader,
  renderLinks,
  renderSkills,
} from "./components";
import { fetchScrapboxPages, renderScrapboxPages } from "./scrapbox";

// ページ全体のHTMLを生成
function renderHTML(scrapboxContent: string) {
  return `
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    ${renderHeader()}

    <main class="container mx-auto px-6 py-12">
      ${renderAbout()}
      ${renderSkills()}
      ${renderLinks(scrapboxContent)}
    </main>

    ${renderFooter()}
  </div>
  `;
}

// ローディング状態で初期表示
const loadingHTML = `
  <div class="text-center py-8">
    <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    <p class="mt-4 text-gray-600">記事を読み込み中...</p>
  </div>
`;

const appDiv = document.querySelector<HTMLDivElement>("#app");
if (appDiv) {
  appDiv.innerHTML = renderHTML(loadingHTML);
}

// Scrapboxデータを非同期で読み込み
async function loadScrapboxData() {
  const data = await fetchScrapboxPages();
  const scrapboxHTML = renderScrapboxPages(data);

  // Scrapboxセクションのみ更新
  const scrapboxContent = document.getElementById("scrapbox-content");
  if (scrapboxContent) {
    scrapboxContent.innerHTML = scrapboxHTML;
  }
}

// ページ読み込み時にScrapboxデータをフェッチ
loadScrapboxData();

// スムーススクロールの実装
document.addEventListener("DOMContentLoaded", () => {
  console.log("choromoto.com portfolio loaded successfully!");
});
