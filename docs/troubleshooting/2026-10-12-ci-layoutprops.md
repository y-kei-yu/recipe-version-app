# 手元では通る型チェックが、CI だけで失敗する（2026-10-12）

## 何が起きたか

- PR を作ったら、GitHub Actions の「型チェック」（`npx tsc --noEmit`）で失敗した
- 手元では、同じコマンドが通っていた

```
Error: src/app/layout.tsx(20,50): error TS2304: Cannot find name 'LayoutProps'.
Error: Process completed with exit code 2.
```

## エラーの読み方

| 部分                             | 意味                                   |
| -------------------------------- | -------------------------------------- |
| `src/app/layout.tsx(20,50)`      | `layout.tsx` の20行目・50文字目        |
| `Cannot find name 'LayoutProps'` | `LayoutProps` という名前が見つからない |

`layout.tsx` の書き方（`LayoutProps<"/">`）は、Next.js 16 の正しい書き方。直すべきはコードではなかった。

## 原因

- `LayoutProps` は **Next.js が自動で作る型**。`next dev` / `next build` のときに、`.next/types/` と `next-env.d.ts` に **ファイルとして書き出される**
- この2つは `.gitignore` に入っているので、GitHub には上がらない

|      | `LayoutProps` の型                                                                                      | 結果 |
| ---- | ------------------------------------------------------------------------------------------------------- | ---- |
| 手元 | 前に `make dev` / `make build` を動かしたので **ファイルが残っていた**（`Ctrl + C` で止めても消えない） | 通る |
| CI   | 毎回新品のパソコンで、まだ dev / build を動かしていないので **存在しない**                              | 失敗 |

→ 手元にだけ残っていたファイルに、気づかないうちに頼っていたのが原因。

## 解決法

`ci.yml` の型チェックの **前** に、`npx next typegen` を追加した。

```yaml
- name: 型生成
  run: npx next typegen

- name: 型チェック
  run: npx tsc --noEmit
```

- `next typegen`：dev や build をせずに、Next.js が使う型だけを作るコマンド
- Next.js の公式ドキュメント（CLI の `next typegen` の項）に「CI での型チェックに便利」「`next typegen && tsc --noEmit`」と書かれている

## 確かめ方（手元で再現）

自動で作られたファイルを消して、CI と同じ「新品の状態」にしてから確かめた。

```
rm -rf .next next-env.d.ts
npx tsc --noEmit      # → CI と同じエラーが出る
npx next typegen
npx tsc --noEmit      # → エラーが消える
```

「エラーが出る → 直すと消える」の両方を見て、原因がこれで間違いないと確かめた。

## 学んだこと

- **手元で通っても、CI で落ちることがある**。原因は「手元にだけ残っているファイル」
- **CI は毎回新品のパソコンで動く**。だから、手元の思い込みに気づかせてくれる
- **`.gitignore` に入っている「自動で作られるファイル」は、CI には存在しない**。`/src/generated/prisma` も同じなので、Prisma Client を使い始めたら CI で `prisma generate` が必要になる
- **push 前に、自動で作られたファイルを消してからチェックする** と、CI に近い状態で確かめられる
- 本物の CI は push しないと動かない。手元では、CI の `steps` と同じコマンドを上から順に打って確かめる

## 参考

- https://nextjs.org/docs/app/api-reference/cli/next#next-typegen-options
