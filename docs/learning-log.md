## 2026-10-04

### Vitest のインストールで ERESOLVE エラー

#### 何が起きたか

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

#### エラーの読み方

| 行                                                                   | 意味                                           |
| -------------------------------------------------------------------- | ---------------------------------------------- |
| `Found: @types/node@20.19.43`                                        | 今入っているのは 20                            |
| `peerOptional @types/node@"^22.0.0 \|\| >=24.0.0" from vitest@5.0.3` | Vitest は 22 か 24 以上を求めている            |
| `dev @types/node@"^20" from the root project`                        | `package.json` が `^20` なので 20 から動けない |

#### 原因

3つの事情が重なった。

1. **ひな形が `^20` だった**：`create-next-app` は、Next.js が対応する一番古い Node.js（20）に合わせて `@types/node` を `^20` にする
2. **Vitest 5 が 20 への対応をやめていた**：Node.js 20 は 2026年4月にサポート終了。Vitest 5 は「22 か 24 以上」を求める
3. **npm がずれを見つけて止めた**：パッケージ同士の約束（peer dependency）が守れないため、インストールを中止した

→ 古いもの（ひな形の 20）と新しいもの（Vitest 5）が、同じプロジェクトで出会ったのが原因。

#### 解決法

実際に動かしている Node.js（`.node-version` の `24.21.0`）に合わせて、`@types/node` を 24 に上げた。

```
npm install -D @types/node@24
```

そのあと `npm install -D vitest` が成功した。

#### 学んだこと

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

#### 未解決

- `@vitejs/plugin-react` を入れると、Babel の 7（shadcn が使用）と 8 がぶつかるエラーが出る。別途対応する
