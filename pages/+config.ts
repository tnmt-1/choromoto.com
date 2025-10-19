import type { Config } from "vike/types";

// Vike単体でSSGを設定（クライアント側のJSなし）
export default {
  // SSG（Static Site Generation）を有効化
  prerender: true,
  // クライアント側のJavaScriptを完全に無効化
  clientRouting: false,
} satisfies Config;
