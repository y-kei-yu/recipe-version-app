# 0003 Vitest は Vite 8 の標準機能で設定する

- 日付：2026-10-04
- 状態：決定

## 状況

Next.js 公式ドキュメントの Vitest の手順では、`@vitejs/plugin-react`（JSX の変換）と `vite-tsconfig-paths`（`@/` の解決）を入れることになっている。しかし `@vitejs/plugin-react` は、shadcn が使う Babel 7 と、その先の部品が求める Babel 8 がぶつかり、インストールできなかった。

## 決定

どちらの部品も使わず、Vitest 5 が使う Vite 8 の標準機能で設定する。

- JSX の変換：Vite 8 に標準で入っている Oxc に任せる（`tsconfig.json` の `"jsx": "react-jsx"` に従う）
- `@/` の解決：`vitest.config.mts` の `resolve.tsconfigPaths: true`

## 理由・影響

- Babel のバージョンのぶつかりを、無理に解決せずに避けられる
- `vite-tsconfig-paths` が使う `tsconfck` は「unmaintained（手入れされていない）」と警告が出ていた。使わずに済む
- 入れるパッケージが減り、設定もシンプルになる
- JSX を使うサンプルテストが通ることで確認済み
- 今後 Vitest や Next.js の公式手順が変わったら、見直す
- 詳細：`docs/troubleshooting/2026-10-04-vitest-eresolve.md`
