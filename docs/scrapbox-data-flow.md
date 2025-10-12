# Scrapbox データ取得の仕組み

このプロジェクトでは、Scrapboxのデータを2つの方法で取得できます。

## 📁 関連ファイル

- `plugins/vite-plugin-scrapbox.js` - ビルド時のデータ取得（Node.js）
- `src/scrapbox.ts` - ブラウザでのデータ取得（クライアントサイド）

## 🔄 動作フロー

### 本番環境（`pnpm build` → デプロイ）

```md
1. ビルド開始
   ↓
2. vite-plugin-scrapbox.js の fetchScrapboxData() 実行 ← Node.js環境
   ↓
3. Scrapbox API からデータ取得
   ↓
4. HTMLに <script>window.__SCRAPBOX_DATA__ = {...}</script> を埋め込む
   ↓
5. ビルド完了（dist/index.html にデータが含まれる）
   ↓
6. ユーザーがページを開く
   ↓
7. scrapbox.ts の fetchScrapboxPages() 実行 ← ブラウザ環境
   ↓
8. window.__SCRAPBOX_DATA__ をチェック
   ↓
9. データが存在 → そのまま返す（APIは呼ばない）✅
   ↓
10. ページに表示
```

### 開発環境（`pnpm dev`）

```md
1. 開発サーバー起動
   ↓
2. プラグインは動かない（buildStart は実行されない）
   ↓
3. ユーザーがページを開く
   ↓
4. scrapbox.ts の fetchScrapboxPages() 実行 ← ブラウザ環境
   ↓
5. window.__SCRAPBOX_DATA__ をチェック
   ↓
6. データが存在しない
   ↓
7. fetchFromScrapboxAPI() を呼ぶ ← ブラウザから直接API呼び出し
   ↓
8. Scrapbox API からデータ取得
   ↓
9. ページに表示
```

## 🎯 それぞれの役割

### `vite-plugin-scrapbox.js`

| 項目 | 内容 |
|------|------|
| 実行環境 | Node.js（サーバーサイド） |
| 実行タイミング | ビルド時（`pnpm build`） |
| 目的 | SSG - データをHTMLに埋め込む |
| API呼び出し | あり（ビルド時に1回だけ） |
| メリット | ユーザーの読み込み速度向上、API制限回避 |

### `src/scrapbox.ts`

| 項目 | 内容 |
|------|------|
| 実行環境 | ブラウザ（クライアントサイド） |
| 実行タイミング | ページ読み込み時 |
| 目的 | SSGデータ利用 or フォールバック |
| API呼び出し | 条件付き（SSGデータがない場合のみ） |
| メリット | 開発環境でも動作する |

## 💡 重要なポイント

### 1. 本番では API を2回呼ばない

本番ビルドでは：

- ✅ ビルド時に1回だけAPIを呼ぶ（プラグイン）
- ❌ ブラウザではAPIを呼ばない（すでにデータがある）

### 2. 開発環境でも動作する

開発サーバーでは：

- ❌ ビルドしないのでプラグインは動かない
- ✅ ブラウザがAPIを呼ぶ（フォールバック機能）

### 3. SSG（Static Site Generation）の恩恵

- ⚡ ページ表示が速い（データがすでにある）
- 🔒 API制限を気にしなくて良い（ユーザーごとに呼ばない）
- 📦 HTMLファイル1つで完結（CDNで配信可能）

## 🔧 環境変数

`.env` で設定できます：

```bash
VITE_SCRAPBOX_PROJECT=your_project_name
```

- プラグイン側：`env.VITE_SCRAPBOX_PROJECT` で取得
- TypeScript側：`import.meta.env.VITE_SCRAPBOX_PROJECT` で取得（将来対応予定）

## 📝 まとめ

| | プラグイン | TypeScript |
|---|---|---|
| 動作場所 | Node.js | ブラウザ |
| いつ動く？ | ビルド時 | ページ読み込み時 |
| API呼ぶ？ | はい（毎回） | 条件付き（SSGデータがない場合） |
| 目的 | データ埋め込み | データ表示 |

**結論：本番では片方だけ動く！**

- ビルド時：プラグインのfetchが動く ✅
- 実行時：TypeScriptのfetchは動かない（データがあるから）❌
