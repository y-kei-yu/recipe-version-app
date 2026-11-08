# 学習ログ

その日に学んだこと・詰まったことを1〜3行で残す。くわしい記録は `troubleshooting/` に置く。

## 2026-10-04

- Vitest のインストールで ERESOLVE エラー。`create-next-app` のひな形の `@types/node` が `^20` のままで、Vitest 5 が求める 22 / 24 以上と合わなかった。実行環境の Node.js 24 に合わせて直した（→ [troubleshooting/2026-10-04-vitest-eresolve.md](troubleshooting/2026-10-04-vitest-eresolve.md)）

## 2026-10-12

- CI の型チェックだけ失敗した（`LayoutProps` が見つからない）。手元には `next dev` / `next build` で作られた型ファイルが残っていたが、CI は毎回新品なので存在しなかった。`next typegen` を型チェックの前に追加して直した（→ [troubleshooting/2026-10-12-ci-layoutprops.md](troubleshooting/2026-10-12-ci-layoutprops.md)）

## 2026-10-25

- `next dev` で Rosetta 2 の警告。ターミナルアプリが「Rosetta を使用して開く」になっていて、Node.js が Intel 版で入っていた。設定を直し、Node.js と `node_modules` を入れ直した（→ [troubleshooting/2026-10-25-rosetta-node-x64.md](troubleshooting/2026-10-25-rosetta-node-x64.md)）

## 2026-11-03

- ブランチを切り替えたあと、`npx next typegen && npx tsc --noEmit` で型エラー。前のブランチで `next dev` を動かしたときの `.next/dev/types/` が古いまま残っていて、今のブランチにないページを探していた。`make dev` で作り直して解決（`rm -rf .next` で消してもよい）（→ [troubleshooting/2026-11-03-ブランチ切り替え後の型エラー.md](troubleshooting/2026-11-03-ブランチ切り替え後の型エラー.md)）

## 2026-11-07

- テストを書いたら、更新日の月・日が1桁（2026-11-1）になるバグが見つかった。month: '2-digit' と day: '2-digit' で直した
- getByTestId より getByText / getByRole を優先する（利用者が見ているもので確かめるため）
- within で「どの欄に表示されているか」まで確かめられる

## 2026-11-08

- queryAllByRole は見つからないと null ではなく [] を返す。"null" と文字列で書いてしまい、必ず通る（何も確かめていない）テスト になっていた → jest-dom を導入（→ [adr/0004-jest-domを使う.md](adr/0004-jest-domを使う.md)）
