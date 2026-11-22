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

## 2026-11-21（MVP3 レシピ詳細画面）

- `find` は配列ではなく1件そのものを返し、見つからないと `undefined`。`filter` は見つからないと `[]` を返すので `if (!結果)` では判定できない（`[]` も「ある」扱い）
- `Number("abc")` は `NaN` になり、`NaN` はどの数とも等しくならないので、存在しない id と同じ `if (!recipe) notFound()` で数値でない id にも対応できた
- 記事の正規表現（`/\r\n|\n/`）をまねしたが、保存時に改行を `\n` に統一する設計なので、表示では `split("\n")` で十分だった。記事のコードは「自分のアプリでも必要か」を考えてから使う
- テストは「壊れたら失敗するか」で考える。id が `1` のデータだけだと、リンク先に `1` を直接書くまちがいに気づけないので、id が `2` のデータで確かめた
- `async` のページのテスト：エラーを確かめるときは `await` せずに `await expect(...).rejects.toThrow()`、表示を確かめるときは `await` で中身を取り出してから `render`
- Vitest も開発サーバーも型はチェックしない。テストが通っても型のまちがいは残るので、`make check`（`tsc`）で確かめる
