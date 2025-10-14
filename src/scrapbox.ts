import { siteConfig } from "@/site.config";

// Scrapbox API レスポンス型定義
export interface ScrapboxPage {
  id: string;
  title: string;
  image: string | null;
  descriptions: string[];
  user: { id: string };
  pin: number; // pinされてないときは0
  views: number;
  linked: number;
  commitId: string;
  created: number;
  updated: number;
  accessed: number;
  lastAccessed?: number;
  snapshotCreated: number | null;
  pageRank: number;
}

export interface ProjectResponse {
  projectName: string; // data取得先のproject名
  skip: number; // parameterに渡したskipと同じ
  limit: number; // parameterに渡したlimitと同じ
  count: number; // projectの全ページ数 (中身のないページを除く)
  pages: ScrapboxPage[];
}

// グローバルに埋め込まれたデータの型定義
declare global {
  interface Window {
    __SCRAPBOX_DATA__?: ProjectResponse;
  }
}

/**
 * Scrapboxデータを取得（ビルド時に埋め込まれたデータを優先）
 *
 * 【動作タイミング】
 * - ブラウザでページが読み込まれたとき
 *
 * 【動作フロー】
 * 1. まず window.__SCRAPBOX_DATA__ をチェック（ビルド時に埋め込まれたデータ）
 * 2. データがあれば、それを返す（本番環境での動作）
 * 3. データがなければ、fetchFromScrapboxAPI() を呼ぶ（開発環境での動作）
 *
 * 【本番環境】
 * - pnpm build で vite-plugin-scrapbox.js がデータを埋め込む
 * - ここでは API を呼ばない（すでにデータがある）
 *
 * 【開発環境】
 * - pnpm dev ではプラグインが動かない
 * - ここで API を呼ぶ（フォールバック）
 */
export async function fetchScrapboxPages(): Promise<ProjectResponse | null> {
  // ビルド時に埋め込まれたデータがあればそれを使用（SSG）
  if (typeof window !== "undefined" && window.__SCRAPBOX_DATA__) {
    console.log("✓ Using pre-rendered Scrapbox data (SSG)");
    return window.__SCRAPBOX_DATA__;
  }

  // フォールバック: クライアントサイドでAPI呼び出し（開発環境用）
  return await fetchFromScrapboxAPI();
}

/**
 * Scrapbox APIからデータを取得
 *
 * ⚠️ この関数はブラウザ（クライアントサイド）でのみ実行されます
 * ビルド時には実行されません！
 *
 * 【使用されるケース】
 * - 開発環境（pnpm dev）で動作確認するとき
 * - ビルド時にデータ取得が失敗したとき
 */
async function fetchFromScrapboxAPI(): Promise<ProjectResponse | null> {
  const API_BASE_URL = "https://scrapbox.io/api/pages";
  // APIパラメータを文字列に変換（数値などを含む場合でも対応）
  const apiParams = Object.fromEntries(
    Object.entries(siteConfig.scrapbox.api).map(([key, value]) => [
      key,
      String(value),
    ])
  );
  const params = new URLSearchParams(apiParams);
  const apiUrl = `${API_BASE_URL}/${siteConfig.scrapbox.projectName}?${params.toString()}`;

  console.log("⚠ Fetching Scrapbox data from API (client-side)");
  console.log(`  Project: ${siteConfig.scrapbox.projectName}`);
  console.log(`  URL: ${apiUrl}`);

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    // レスポンスステータスの確認
    if (!response.ok) {
      const errorMessage = `Scrapbox API error: ${response.status} ${response.statusText}`;
      console.error(errorMessage);

      // 詳細なエラー情報を取得
      try {
        const errorData = await response.text();
        console.error("Error details:", errorData);
      } catch (parseError) {
        console.error("Could not parse error response", parseError);
      }

      throw new Error(errorMessage);
    }

    // JSONをパース
    const data: ProjectResponse = await response.json();

    // データの検証
    if (!data || typeof data !== "object") {
      throw new Error("Invalid response format: response is not an object");
    }

    if (!data.projectName) {
      throw new Error("Invalid response format: missing projectName");
    }

    if (!Array.isArray(data.pages)) {
      throw new Error("Invalid response format: pages is not an array");
    }

    console.log(
      `✓ Successfully fetched ${data.pages.length} pages from Scrapbox`,
    );
    console.log(`  Project: ${data.projectName}`);
    console.log(`  Total pages: ${data.count}`);

    return data;
  } catch (error) {
    // エラーの詳細をログに出力
    if (error instanceof Error) {
      console.error("Error fetching Scrapbox pages:");
      console.error(`  Message: ${error.message}`);
      console.error(`  Stack: ${error.stack}`);
    } else {
      console.error("Unknown error fetching Scrapbox pages:", error);
    }

    return null;
  }
}

/**
 * ScrapboxページのHTMLを生成
 */
export function renderScrapboxPages(data: ProjectResponse | null): string {
  if (!data || !data.pages || data.pages.length === 0) {
    return `
      <div class="text-center py-8">
        <p class="text-gray-500">最新の記事を読み込めませんでした</p>
      </div>
    `;
  }

  const pagesHtml = data.pages
    .map(
      (page) => `
        <a href="https://scrapbox.io/${data.projectName}/${encodeURIComponent(page.title)}"
           target="_blank"
           rel="noopener noreferrer"
           class="block bg-white hover:bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200">
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <h4 class="text-lg font-medium text-gray-900 truncate mb-1">${escapeHtml(page.title)}</h4>
              ${
                page.descriptions && page.descriptions.length > 0
                  ? `<p class="text-sm text-gray-600 line-clamp-2">${escapeHtml(page.descriptions[0])}</p>`
                  : ""
              }
            </div>
            <svg class="w-5 h-5 text-purple-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
          <div class="mt-2 flex items-center gap-4 text-xs text-gray-500">
            <span>👁 ${page.views}</span>
            <span>🔗 ${page.linked}</span>
            <span>📅 ${formatDate(page.updated)}</span>
          </div>
        </a>
      `,
    )
    .join("");

  return `
    <div class="space-y-3">
      ${pagesHtml}
    </div>
    <div class="mt-6 text-center">
      <a href="https://scrapbox.io/${data.projectName}"
         target="_blank"
         rel="noopener noreferrer"
         class="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium">
        すべての記事を見る
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
        </svg>
      </a>
    </div>
  `;
}

/**
 * HTMLエスケープ
 */
function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * タイムスタンプをフォーマット
 */
function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "今日";
  } else if (diffDays === 1) {
    return "昨日";
  } else if (diffDays < 7) {
    return `${diffDays}日前`;
  } else if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)}週間前`;
  } else if (diffDays < 365) {
    return `${Math.floor(diffDays / 30)}ヶ月前`;
  } else {
    return date.toLocaleDateString("ja-JP");
  }
}
