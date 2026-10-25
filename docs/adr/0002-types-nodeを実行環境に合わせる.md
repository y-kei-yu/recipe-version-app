# 0002 `@types/node` は実行環境の Node.js に合わせる

- 日付：2026-10-04
- 状態：決定

## 状況

`create-next-app` のひな形で、`@types/node` が `^20` になっていた。一方、実際に動かしている Node.js は `.node-version` の `24.21.0`。Vitest 5 を入れようとしたところ、`@types/node` が 22 か 24 以上でないとインストールできなかった。

## 決定

`@types/node` を 24 系にする（`npm install -D @types/node@24`）。今後も、Node.js のバージョンを上げるときは `@types/node` も同じバージョンにそろえる。

## 理由・影響

- 型の説明書と実際の Node.js がずれていると、型の上では使える機能が、実行時にはない（またはその逆）ということが起きる
- 手元・GitHub Actions・Vercel のすべてで `.node-version` の Node.js 24 を使うので、型もそれに合わせる
- 詳細：`docs/troubleshooting/2026-10-04-vitest-eresolve.md`
