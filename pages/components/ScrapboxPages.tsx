import type { ProjectResponse, ScrapboxPage } from "../+data";

interface ScrapboxPagesProps {
  data: ProjectResponse | null;
}

/**
 * タイムスタンプをJSTでフォーマット（アクセス時に動的に計算）
 */
function formatDate(timestamp: number): string {
  // JSTのタイムゾーンでDateオブジェクトを作成
  const date = new Date(timestamp * 1000);
  const now = new Date();
  
  // JSTでの日付の開始時刻を計算（0時0分0秒）
  const jstDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  const jstNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  
  // 日付の開始時刻（0時0分0秒）を取得
  const dateStart = new Date(jstDate.getFullYear(), jstDate.getMonth(), jstDate.getDate());
  const nowStart = new Date(jstNow.getFullYear(), jstNow.getMonth(), jstNow.getDate());
  
  const diffTime = nowStart.getTime() - dateStart.getTime();
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
    return jstDate.toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" });
  }
}

function ScrapboxPageItem({ page, projectName }: { page: ScrapboxPage; projectName: string }) {
  return (
    <a
      href={`https://scrapbox.io/${projectName}/${encodeURIComponent(page.title)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white hover:bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-medium text-gray-900 truncate mb-1">{page.title}</h4>
          {page.descriptions && page.descriptions.length > 0 && (
            <p className="text-sm text-gray-600 line-clamp-2">{page.descriptions[0]}</p>
          )}
        </div>
        <svg className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
        </svg>
      </div>
      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
        <span>👁 {page.views}</span>
        <span>🔗 {page.linked}</span>
        <span>📅 {formatDate(page.updated)}</span>
      </div>
    </a>
  );
}

export function ScrapboxPages({ data }: ScrapboxPagesProps) {
  if (!data || !data.pages || data.pages.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">最新の記事を読み込めませんでした</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {data.pages.map((page: ScrapboxPage) => (
          <ScrapboxPageItem key={page.id} page={page} projectName={data.projectName} />
        ))}
      </div>
      <div className="mt-6 text-center">
        <a
          href={`https://scrapbox.io/${data.projectName}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
        >
          すべての記事を見る
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
          </svg>
        </a>
      </div>
    </>
  );
}

export function LoadingSpinner() {
  return (
    <div className="text-center py-8">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      <p className="mt-4 text-gray-600">記事を読み込み中...</p>
    </div>
  );
}
