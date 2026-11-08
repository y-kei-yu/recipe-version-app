# 0004 jest-domを導入

- 日付：2026-11-08
- 状態：決定

## 状況

MVP2のテストコードを書いていた時、画面に指定した文字が表示されているか確認するのにvitestの標準のマッチャー「toBeDefined()」を使用していたが、
toBeDefined() だと、「画面に表示されているか」を見ているテストだと、読んだだけでは分かりにくい
また、0件テスト作成で、queryAllByRole が返す値を "null" と書き間違えて、何も確かめていないのに通るテスト を書いてしまい、データがないことを確かめづらい

## 決定

「toBeInTheDocument() などのマッチャーを使えるようにする」jest-domを導入する

## 理由・影響

- 設定ファイル（vitest.setup.ts）を追加し、vitest.config.mts の setupFiles で読み込むようにした
- toBeInTheDocument() を使うと、「画面に表示されていること」が読み取れるようになる
- not.toBeInTheDocument() で、「ないこと」を読んだまま書ける
- toHaveAttribute() で、リンクの行き先（href）を1行で確かめられる
- 別のリポジトリでjest-domを使用していて、使い慣れているから
- すでに作成しているMVP2のテストに修正が必要になる
