# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

「麻雀ヤリタイ」(Mahjong Yaritai) - Next.js 15 + React 18 + TypeScript で構築された日本の麻雀コミュニティプラットフォームです。麻雀問題の解決、投票、コメント、学習機能に焦点を当てたアプリケーションです。

## 現在の移行状況

### API通信の移行（GraphQL → fetch + Server Actions）

- **移行前**: Zodiosクライアント + GraphQL
- **移行後**: Server Actions + 通常の fetch API
- 新規実装は Server Actions パターンを使用すること

### UIフレームワークの移行（Chakra UI → HTML + Tailwind）

- **移行前**: Chakra UI 2.x
- **移行後**: HTML + Tailwind CSS 4.x + 自作コンポーネント
- Modal、Toast などは自作コンポーネントを使用
- 新規実装は Tailwind + 自作コンポーネントを使用すること

## 開発コマンド

### 基本開発

```bash
# 開発サーバー起動
pnpm dev

# プロダクションビルド
pnpm build

# 型チェック
pnpm typecheck

# リンティング
pnpm lint
pnpm lint:fix

# コードフォーマット
pnpm format
```

### 環境セットアップ

```bash
# 環境変数の設定
cp .env.local .env

# Gitフック設定（コミット時に自動でESLint & Prettierを実行）
git config core.hooksPath .githooks
chmod +x .githooks/*
```

## アーキテクチャ概要

### 認証アーキテクチャ

```
ブラウザ <--Cookie--> Next.js (BFF) <--JWT--> Rails API
```

- **ブラウザ ↔ Next.js**: httpOnly Cookie で `access_token` と `refresh_token` を管理
- **Next.js ↔ Rails API**: Authorization ヘッダーで JWT を送信
- **トークン管理**: Server Actions 内で Cookie の読み書きを行う

### アプリケーション構造

- **Next.js App Router**: Next.js 15 の App Router パターンを使用
- **機能ベースアーキテクチャ**: 各機能はページディレクトリ内にコロケーション
- **Server Actions**: API通信は Server Actions で行い、クライアントには結果のみ返す

### 主要ディレクトリ

```
src/
├── app/                          # Next.js App Router
│   └── [feature]/
│       ├── page.tsx              # ページコンポーネント
│       ├── _components/          # 機能固有コンポーネント
│       ├── _actions/             # Server Actions
│       └── _types.ts             # 機能固有の型定義
├── components/                   # 共有UIコンポーネント
│   ├── Modal.tsx                 # 自作モーダル
│   └── ...
├── contexts/                     # グローバルコンテキスト
│   └── ToastProvider.tsx         # 自作トースト
├── hooks/                        # カスタムフック
│   ├── useToast.ts
│   ├── useDisclosure.ts
│   └── ...
└── types/                        # 共通型定義
    ├── apiResult.ts
    └── components.ts             # コンポーネント用の型定義
```

### 主要機能

1. **what-to-discard-problems** - 投票、コメント、問題解決を含むコア機能
2. **認証システム** - メールトークン認証 + Google/LINE OAuth
3. **ユーザープロフィール** - ユーザー管理とプロフィール編集
4. **学習モジュール** - 教育コンテンツ

## 開発パターン

### Server Actions パターン（推奨）

Server Actions を使って API 通信を行い、Cookie の管理もサーバーサイドで行います。

**ファイル配置**: `src/app/[feature]/_actions/[action].ts`
### エラー処理
```typescript
catch(error) {
  console.error("logout error:", error);
  return {
    data: null,
    errors: error instanceof Error ? [error.message] : ["予期せぬエラーが発生しました"],
  };
}

```

### ApiResult 型

Server Actions の戻り値は統一された型を使用:

```typescript
// src/types/apiResult.ts
export type ApiResult<T> = {
  data: T;
  errors: string[] | null;
};
```

### 自作 Toast パターン

`ToastProvider` と `useToast` を使用します。

```typescript
import useToast from "@/src/hooks/useToast";

const toast = useToast();

// 成功
toast({ title: "保存しました", status: "success" });

// エラー
toast({ title: "エラーが発生しました", description: "詳細メッセージ", status: "error" });

// 情報
toast({ title: "お知らせ", status: "info" });

// 警告
toast({ title: "注意", status: "warning" });
```

### 自作 Modal パターン

`<dialog>` 要素を使った自作 Modal と `useDisclosure` フックを使用します。


### ファイル構成（コロケーション）

```
src/app/me/
├── page.tsx                    # ページコンポーネント
├── _components/                # 機能固有コンポーネント（アンダースコア付き）
│   └── DashboardSection/
│       ├── index.tsx
│       └── UserDashboardMenu.tsx
├── _actions/                   # Server Actions（アンダースコア付き）
│   ├── fetchMe.ts
│   ├── updateMe.ts
│   └── logout.ts
└── _types.ts                   # 機能固有の型定義（アンダースコア付き）
```

**命名規則**:

- `_components/`, `_actions/`, `_types.ts`: アンダースコアプレフィックスで機能固有を明示
- Server Actions ファイル名: 動詞形（`fetchMe.ts`, `updateMe.ts`, `logout.ts`）

## 重要な技術詳細

### TypeScript設定

- **Strictモード有効** (`strict: true`)
- パスエイリアス: `@/*` がリポジトリルートにマップ
- モダンなESNextターゲット (`module: ESNext`, `target: ESNext`)

### スタイリングシステム

- **Tailwind CSS 4.x** をメインで使用
- `src/styles/globals.css` のグローバルスタイル
- Chakra UI は移行中のため一部残存（新規実装では使用しない）

### 開発ワークフロー

1. プリコミットフックがステージングファイルで自動的にESLintとPrettierを実行
2. コミット前に `pnpm typecheck` でTypeScript型を検証
3. バックエンドAPIは `http://localhost:3001` で動作している必要がある（`.env`で設定）
