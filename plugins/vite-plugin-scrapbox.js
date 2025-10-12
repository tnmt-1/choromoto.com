/**
 * Scrapbox APIからデータを取得
 *
 * ⚠️ この関数はビルド時（Node.js環境）でのみ実行されます
 * ブラウザでは実行されません！
 *
 * @param {string} projectName - Scrapboxプロジェクト名
 * @param {Object} options - オプション
 * @returns {Promise<Object|null>}
 */
async function fetchScrapboxData(
  projectName,
  { sort = "updated", skip = 3, limit = 5 } = {},
) {
  const API_BASE_URL = "https://scrapbox.io/api/pages";
  const params = new URLSearchParams({
    sort,
    skip: String(skip),
    limit: String(limit),
  });
  const apiUrl = `${API_BASE_URL}/${projectName}?${params.toString()}`;

  console.log(`📦 Fetching Scrapbox data from: ${apiUrl}`);

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "vite-plugin-scrapbox/1.0.0",
      },
    });

    // レスポンスステータスの確認
    if (!response.ok) {
      const errorMessage = `Scrapbox API error: ${response.status} ${response.statusText}`;
      console.error(`⚠ ${errorMessage}`);

      // 詳細なエラー情報を取得
      let errorDetails = "";
      try {
        errorDetails = await response.text();
        if (errorDetails) {
          console.error(`   Details: ${errorDetails.substring(0, 200)}`);
        }
      } catch (e) {
        // エラーレスポンスのパースに失敗しても続行
        console.error("Could not parse error response", e);
      }

      throw new Error(errorMessage);
    }

    // JSONをパース
    const data = await response.json();

    // データの検証
    if (!data || typeof data !== "object") {
      throw new Error("Invalid response: not an object");
    }

    if (!data.projectName) {
      throw new Error("Invalid response: missing projectName");
    }

    if (!Array.isArray(data.pages)) {
      throw new Error("Invalid response: pages is not an array");
    }

    // 成功ログ
    console.log(`✓ Successfully fetched Scrapbox data:`);
    console.log(`   Project: ${data.projectName}`);
    console.log(`   Pages: ${data.pages.length} / ${data.count} total`);
    console.log(`   Skip: ${data.skip}, Limit: ${data.limit}`);

    return data;
  } catch (error) {
    // エラーハンドリング
    console.error("⚠ Error fetching Scrapbox data:");
    if (error instanceof Error) {
      console.error(`   Message: ${error.message}`);
      if (error.stack) {
        console.error(`   Stack: ${error.stack.split("\n")[1]?.trim()}`);
      }
    } else {
      console.error(`   Unknown error: ${String(error)}`);
    }

    // エラー時のフォールバックデータ
    return {
      projectName: projectName,
      pages: [],
      skip: skip,
      limit: limit,
      count: 0,
    };
  }
}

// Viteプラグイン: ビルド時にScrapboxデータを取得してHTMLに注入
//
// 【動作タイミング】
// - pnpm build を実行したとき（ビルド時）
// - pnpm dev では実行されない（開発サーバーでは buildStart は呼ばれない）
//
// 【目的】
// - SSG（Static Site Generation）でデータをHTMLに埋め込む
// - ユーザーがページを開いたときにはすでにデータが存在している
// - APIへのリクエストを減らし、表示速度を向上させる
export function scrapboxDataPlugin(env = {}) {
  let scrapboxData = null;
  const SCRAPBOX_PROJECT = env.VITE_SCRAPBOX_PROJECT;

  return {
    name: "vite-plugin-scrapbox-data",

    async buildStart() {
      // ビルド開始時にScrapboxデータを取得
      console.log("\n--- Scrapbox Data Fetching ---");
      console.log(`   Project: ${SCRAPBOX_PROJECT}`);
      scrapboxData = await fetchScrapboxData(SCRAPBOX_PROJECT, {
        sort: "updated",
        skip: 3,
        limit: 5,
      });
      console.log("--- Scrapbox Data Fetching Complete ---\n");
    },

    transformIndexHtml(html) {
      // HTMLにデータを埋め込む
      if (scrapboxData) {
        const scriptTag = `<script>window.__SCRAPBOX_DATA__ = ${JSON.stringify(scrapboxData)};</script>`;
        return html.replace("</head>", `${scriptTag}</head>`);
      }
      return html;
    },
  };
}
