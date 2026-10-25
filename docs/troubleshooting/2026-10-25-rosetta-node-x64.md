# Apple Silicon の Mac で Node.js が Intel 版になっていた（2026-10-25）

## 何が起きたか

- `make dev`（`next dev`）を動かすと、次の警告が出た
- 動きは正しかったが、遅くなる可能性があると言われた

```
⚠ You are running Next.js on an Apple Silicon Mac with Rosetta 2 translation, which may cause degraded performance. You may have accidentally installed an x86-64 version of Node.js.
```

- 前に `npx prisma -v` を打ったときも、`Architecture : x64` と出ていた

## エラーの読み方

| 部分 | 意味 |
|---|---|
| `Apple Silicon Mac` | M1・M2 などの Mac。CPU の種類は `arm64` |
| `Rosetta 2 translation` | Intel 向けのプログラムを、Apple Silicon で動くようにその場で通訳する仕組み |
| `x86-64 version of Node.js` | Intel 向けの Node.js が入っている |

## 原因を調べた手順

| コマンド | 結果 | 分かったこと |
|---|---|---|
| `sysctl -n machdep.cpu.brand_string` | `Apple M2 Pro` | Mac は Apple Silicon |
| `uname -m` | `x86_64` | ターミナルが Intel 向けとして動いている |
| `sysctl -n sysctl.proc_translated` | `1` | ターミナルが Rosetta で通訳されている |
| `node -p process.arch` | `x64` | Node.js も Intel 版 |
| `which node` | `~/.anyenv/envs/nodenv/shims/node` | Node.js は nodenv で入れたもの |
| `which brew` | `/usr/local/bin/brew` | Homebrew も Intel 版（Apple Silicon 版は `/opt/homebrew`） |

さらに、アクティビティモニタの「種類」の列で、アプリごとに確認した。

| アプリ | 種類 | VS Code の中で `uname -m` |
|---|---|---|
| VS Code | Apple | `arm64` |
| ターミナル | **Intel** | － |

## 原因

- Mac の「ターミナル」アプリに、**「Rosetta を使用して開く」のチェックが入っていた**
- その通訳されたターミナルで nodenv から Node.js を入れたため、**Node.js が Intel 版で入った**
- Node.js は入れたときの種類のまま残るので、通訳のない VS Code の中のターミナルで使っても Intel 版のままだった
- Homebrew も同じく、通訳されたターミナルで入れたため Intel 版になっていた

→ Apple Silicon が出たばかりのころ（2020〜2021年ごろ）は、Homebrew や Node.js が未対応だったため「ターミナルを Rosetta で開く」という手順の解説記事が多かった。それに従って設定した可能性が高い。

## 解決法

### 1. ターミナルの設定を直す

Finder →「アプリケーション」→「ユーティリティ」→「ターミナル」を右クリック →「情報を見る」→ **「Rosetta を使用して開く」のチェックを外す**。開き直して `uname -m` が `arm64` になったことを確認。

### 2. Node.js を Apple Silicon 版で入れ直す

入れ直す前に、消えて困るものがないか確認した。

```
nodenv versions          # 入っている Node.js の一覧
npm ls -g --depth=0      # グローバルに入れたパッケージ（corepack と npm だけだった）
```

```
nodenv uninstall 24.21.0
nodenv install 24.21.0
node -p process.arch     # → arm64
```

### 3. `node_modules` を作り直す

Prisma や Next.js などは、Mac の種類ごとに別々の部品を使うため、Intel 版の部品が残っていた。

```
rm -rf node_modules .next
npm ci
npx prisma -v            # Architecture が arm64 になったことを確認
```

`make dev` で警告が出なくなったことを確認した。

## 学んだこと

- **Rosetta 2**：Intel 向けのアプリを Apple Silicon で動かす「通訳」。動くが、そのぶん遅くなる
- **アプリの種類は、アクティビティモニタの「種類」の列で確認できる**（`Apple` / `Intel`）
- **ターミナルの種類で、その中で入れるものの種類が決まる**。通訳されたターミナルで入れると、Node.js も Homebrew も Intel 版になる
- **入れたものは、設定を直しても自動では変わらない**。入れ直しが必要
- **`node_modules` には、Mac の種類ごとの部品が入っている**。Node.js の種類を変えたら作り直す
- 同じバージョン（24.21.0）を使うほかのプロジェクトも、エラーが出たら `node_modules` を作り直す
- 原因を「ターミナル → Node.js → node_modules」と順番に切り分けて調べた

## 残っていること

- Homebrew が Intel 版（`/usr/local`）のまま。このプロジェクトでは使っていないので、別途対応する
- nodenv の 22.13.1・24.5.0 は Intel 版のまま。使うときに入れ直す
