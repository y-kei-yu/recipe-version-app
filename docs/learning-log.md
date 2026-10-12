# 学習ログ

その日に学んだこと・詰まったことを1〜3行で残す。くわしい記録は `troubleshooting/` に置く。

## 2026-10-04

- Vitest のインストールで ERESOLVE エラー。`create-next-app` のひな形の `@types/node` が `^20` のままで、Vitest 5 が求める 22 / 24 以上と合わなかった。実行環境の Node.js 24 に合わせて直した（→ [troubleshooting/2026-10-04-vitest-eresolve.md](troubleshooting/2026-10-04-vitest-eresolve.md)）

## 2026-10-12

- CI の型チェックだけ失敗した（`LayoutProps` が見つからない）。手元には `next dev` / `next build` で作られた型ファイルが残っていたが、CI は毎回新品なので存在しなかった。`next typegen` を型チェックの前に追加して直した（→ [troubleshooting/2026-10-12-ci-layoutprops.md](troubleshooting/2026-10-12-ci-layoutprops.md)）
