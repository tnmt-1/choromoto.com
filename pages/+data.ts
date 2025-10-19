import type { PageContextServer } from "vike/types";

import { siteConfig } from "@/site.config";

export type Data = Awaited<ReturnType<typeof data>>;

export async function data(_pageContext: PageContextServer) {
  // ビルド時にScrapboxデータを取得
  const scrapboxData = await fetchFromScrapboxAPI();

  return {
    scrapboxData,
  };
}


// Scrapbox API レスポンス型定義
export interface ScrapboxPage {
  id: string;
  title: string;
  image: string | null;
  descriptions: string[];
  user: { id: string };
  pin: number;
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
  projectName: string;
  skip: number;
  limit: number;
  count: number;
  pages: ScrapboxPage[];
}

/**
 * Scrapbox APIからデータを取得
 */
async function fetchFromScrapboxAPI(): Promise<ProjectResponse | null> {
  const API_BASE_URL = "https://scrapbox.io/api/pages";
  // APIパラメータを文字列に変換（数値などを含む場合でも対応）
  const apiParams = Object.fromEntries(
    Object.entries(siteConfig.scrapbox.api).map(([key, value]) => [
      key,
      String(value),
    ]),
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
