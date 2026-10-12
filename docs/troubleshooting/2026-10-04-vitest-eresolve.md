# Vitest のインストールで ERESOLVE エラー（2026-10-04）

## 何が起きたか

- Vitest を導入しようとしたら、`npm install` が `ERESOLVE`（依存関係を解決できない）エラーで止まった
- 最初は Vitest・React Testing Library など6つを同時に入れていたため、`npm install -D vitest` だけを実行して切り分けた

```
% npm install -D vitest
npm error code ERESOLVE
npm error ERESOLVE could not resolve
npm error
npm error While resolving: vitest@5.0.3
npm error Found: @types/node@20.19.43
npm error node_modules/@types/node
npm error   @types/node@"*" from @types/pg@8.23.1
npm error   node_modules/@types/pg
npm error     @types/pg@"^8.16.0" from @prisma/adapter-pg@7.10.0
npm error     node_modules/@prisma/adapter-pg
npm error       @prisma/adapter-pg@"^7.10.0" from the root project
npm error   dev @types/node@"^20" from the root project
npm error   1 more (vite)
npm error
npm error Could not resolve dependency:
npm error peerOptional @types/node@"^22.0.0 || >=24.0.0" from vitest@5.0.3
npm error node_modules/vitest
npm error   dev vitest@"*" from the root project
npm error
npm error Conflicting peer dependency: @types/node@26.6.4
npm error node_modules/@types/node
npm error   peerOptional @types/node@"^22.0.0 || >=24.0.0" from vitest@5.0.3
npm error   node_modules/vitest
npm error     dev vitest@"*" from the root project
npm error
npm error Fix the upstream dependency conflict, or retry this command with --force or --legacy-peer-deps to accept an incorrect (and potentially broken) dependency resolution.
```

## エラーの読み方

| 行                                                                   | 意味                                           |
| -------------------------------------------------------------------- | ---------------------------------------------- |
| `Found: @types/node@20.19.43`                                        | 今入っているのは 20                            |
| `peerOptional @types/node@"^22.0.0 \|\| >=24.0.0" from vitest@5.0.3` | Vitest は 22 か 24 以上を求めている            |
| `dev @types/node@"^20" from the root project`                        | `package.json` が `^20` なので 20 から動けない |

## 原因

3つの事情が重なった。

1. **ひな形が `^20` だった**：`create-next-app` は、Next.js が対応する一番古い Node.js（20）に合わせて `@types/node` を `^20` にする
2. **Vitest 5 が 20 への対応をやめていた**：Node.js 20 は 2026年4月にサポート終了。Vitest 5 は「22 か 24 以上」を求める
3. **npm がずれを見つけて止めた**：パッケージ同士の約束（peer dependency）が守れないため、インストールを中止した

→ 古いもの（ひな形の 20）と新しいもの（Vitest 5）が、同じプロジェクトで出会ったのが原因。

## 解決法

実際に動かしている Node.js（`.node-version` の `24.21.0`）に合わせて、`@types/node` を 24 に上げた。

```
npm install -D @types/node@24
```

そのあと `npm install -D vitest` が成功した。

## 学んだこと

- **`@types/node` とは**：Node.js の機能（`process.env`、`fs`、`path` など）の型の説明書。Node.js 本体は JavaScript で型を持たないため、TypeScript から使うには別に必要
  - `@types/〜` は「型の説明書だけ」のパッケージ（`@types/react` も同じ）
- **型の説明書は、実際に動かす Node.js と同じバージョンにそろえる**
  - 古すぎると、使える機能が型の上で「ない」ことになる
  - 新しすぎると、まだない機能が型の上で「ある」ことになり、動かしたときに初めてエラーになる
- **`^20` は先頭の数字を変えない**：`20.x.x` の中で一番新しいものが入り、24 には自動で上がらない
- **`npm i @types/node`（バージョン指定なし）では上がらない**：`package.json` にある範囲（`^20`）を守るため。上げたいときは `@24` のように指定する
- **エラーは1つずつ切り分ける**：複数のパッケージを同時に入れると、どれが原因か分からない
- エラーに出ていた `--force` / `--legacy-peer-deps` は使わず、原因を突き止めて直した
- エラーが出るかどうかに関係なく、create-next-app で作ったあとに 1つ確認する習慣 を付ける
  - node -v
    - 今使っている Node.js のバージョンを表示します
      これと、package.json の "@types/node" の数字を見比べて、ずれていたら最初に合わせる。これだけで、今回のエラーは前もって防げます。

## 追記：もう1つのエラー（Babel の 7 と 8 のぶつかり）

## 何が起きたか

- 最初に6つのパッケージを同時に入れたとき、`@types/node` とは別のエラーも出ていた
- 切り分けた結果、原因は `@vitejs/plugin-react` だけだった（ほかの4つは問題なく入った）

```
npm error Found: @babel/core@7.29.7
...
npm error Could not resolve dependency:
npm error dev @vitejs/plugin-react@"*" from the root project
npm error
npm error Conflicting peer dependency: @babel/core@8.0.6
npm error   peer @babel/core@"^8.0.0" from @babel/plugin-transform-runtime@8.0.6
npm error     peerOptional @babel/plugin-transform-runtime@"^7.29.0 || ^8.0.0-rc.1" from @rolldown/plugin-babel@0.2.4
npm error       peerOptional @rolldown/plugin-babel@"^0.1.7 || ^0.2.0" from @vitejs/plugin-react@6.1.1
```

## 原因

|                                   | 求めている Babel |
| --------------------------------- | ---------------- |
| すでに入っている `shadcn`         | 7（`7.29.7`）    |
| `@vitejs/plugin-react` の先の部品 | 8                |

1つのプロジェクトに Babel の 7 と 8 を両方は置けないので、npm がインストールを止めた。

## そもそも何のために入れようとしていたか

- `@vitejs/plugin-react`：テストの中で **JSX**（`<Button />` のような書き方）を普通の JavaScript に翻訳するため
- `vite-tsconfig-paths`：テストの中で `@/` の書き方を使えるようにするため
- どちらも Next.js 公式ドキュメントの Vitest の手順に載っていた

## 解決法：どちらも使わない

- Vitest 5 は、裏側で **Vite 8** を使っている（`npm ls vite` で確認）
- Vite 8 には、次の機能が **最初から入っていた**（`node_modules/vite/dist/node/index.d.ts` で確認）
  - **Oxc**：JSX や TypeScript を翻訳する仕組み。`tsconfig.json` の `"jsx": "react-jsx"` に従って翻訳する
  - **`resolve.tsconfigPaths`**：`tsconfig.json` の `@/` の設定を読む機能
- なので `vitest.config.mts` を Vite 8 の機能だけで書いた

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
  },
});
```

- `@vitejs/plugin-react` は入れず、`vite-tsconfig-paths` は外した（`npm uninstall vite-tsconfig-paths`）

## 確かめ方

- JSX を使うサンプルテスト（`render(<Page />)`）を書いて、`npm run test` が通ることを確認した
- `vite-tsconfig-paths` を外したあとも、もう一度テストが通ることを確認した

## 学んだこと

- **公式ドキュメントの手順が、最新の道具に追いついていないことがある**。Next.js の Vitest の手順は、Vite 8 より前の内容だった
- **エラーを「直す」以外に、「原因の部品を使わずに済むか」を考える**。入れようとした理由を思い出すと、別の方法が見つかることがある
- **外付けの部品を外したら、テストを動かして何も壊れていないか確かめる**
- `vite-tsconfig-paths` が使っていた `tsconfck` は「unmaintained（手入れされていない）」と警告が出ていた。使わずに済むなら使わないほうが安心
- **Vite と Next.js の違い**：Next.js はアプリを作る土台一式（アプリは自前の Turbopack で動く）。Vite は Vitest がテストのときに使う翻訳係。テストのときは Next.js が関わらないので、`vitest.config.mts` で設定が必要

## 参考

- https://nextjs.org/docs/app/guides/testing/vitest#manual-setup
