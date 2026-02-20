# 何切る問題機能 (What to Discard Problems)

## 機能概要

麻雀の手牌（13枚）とツモ牌（1枚）から何を切るべきかを問う問題の作成・表示を中心とした、投票・コメント・いいね機能を統合したプラットフォームです。

## ディレクトリ構造

### コードベース

```
src/features/what-to-discard-problems/
├── components/
│   ├── forms/              # 問題作成・編集フォーム
│   ├── comments/           # コメント機能
│   ├── votes/              # 投票機能
│   ├── likes/              # いいね機能
│   ├── ProblemCard.tsx     # 問題カード表示
│   └── ...
├── context-providers/
│   ├── ProblemsContextProvider.tsx  # 問題一覧管理
│   └── SessionContextProvider.tsx   # セッション状態管理
└── schema/
    └── customWhatToDiscardProblemSchema.ts  # 麻雀牌バリデーション
```

### ドキュメント

```
docs/features/what-to-discard-problems/
├── CLAUDE.md               # このファイル
├── comments/CLAUDE.md      # コメント機能の詳細ドキュメント
├── votes/CLAUDE.md         # 投票機能の詳細ドキュメント
└── likes/CLAUDE.md         # いいね機能の詳細ドキュメント
```

## 主要コンポーネント

### ProblemCard

- **役割**: 問題の表示カード
- **機能**: 問題情報、牌画像、投票状況、コメント数、いいね数の統合表示
- **Props**: `problem` (WhatToDiscardProblem型)

### ProblemCreateFormModal / ProblemUpdateFormModal

- **役割**: 問題の作成・編集フォーム
- **バリデーション**: カスタムZodスキーマで麻雀牌の制約を検証
- **使用フック**: `useProblemForm`

## カスタムバリデーション

### 麻雀牌の制約 (`customWhatToDiscardProblemSchema.ts`)

```typescript
// 同じ牌の重複チェック
MAX_DUPLICATE_TILES_NUM = 4  // 最大4枚まで

// 点数の制約
TOTAL_POINTS = 100000        // 合計点数
POINT_UPPER_LIMIT = 200000   // 上限

// バリデーション項目
- 牌の重複は4枚まで
- 手牌は理牌（ソート）されている必要あり
- 点数の合計が正しいか
```

### フィールド定義

```typescript
handFieldNames = [
  "hand1_id", "hand2_id", ..., "hand13_id"  // 手牌13枚
]

tileFieldNames = [
  ...handFieldNames, "dora_id", "tsumo_id"  // 手牌+ドラ+ツモ
]

pointFieldNames = [
  "point_east", "point_south", "point_west", "point_north"
]
```

## API連携

### 問題管理

- `GET /what_to_discard_problems` - 一覧取得（カーソルページネーション）
- `POST /what_to_discard_problems` - 作成
- `PUT /what_to_discard_problems/:id` - 更新
- `DELETE /what_to_discard_problems/:id` - 削除

### 機能別API

詳細は各機能のCLAUDE.mdを参照：

- **投票**: [votes/CLAUDE.md](votes/CLAUDE.md)
- **コメント**: [comments/CLAUDE.md](comments/CLAUDE.md)
- **いいね**: [likes/CLAUDE.md](likes/CLAUDE.md)

## 状態管理

### ProblemsContext

- **提供値**:
  - `problems`: 問題一覧
  - `setProblems`: 問題一覧更新関数
- **用途**: 一覧ページでの問題管理、リアルタイム更新

### SessionContext

- **提供値**:
  - ログインユーザーの投票状態
  - いいね状態
- **用途**: ユーザー固有の状態管理

## データフロー

1. **問題一覧表示**
   - サーバーコンポーネントでSSR
   - ProblemsContextProviderでラップ
   - クライアントコンポーネントで表示

2. **問題作成**
   - ProblemCreateFormModalで入力
   - customWhatToDiscardProblemSchemaでバリデーション
   - API送信後、一覧を更新

3. **投票・コメント・いいね**
   - 各機能は独立したコンポーネントで実装
   - SessionContext経由で認証状態を確認
   - 詳細は各機能のCLAUDE.mdを参照

## 開発時の注意点

### 麻雀牌の制約

- 牌IDは1-34の範囲（Tileテーブルに対応）
- 同じ牌は最大4枚まで使用可能
- 問題作成時は必ず理牌バリデーションを実行

### フォーム処理

- React Hook Formとカスタムスキーマを併用
- サーバーサイドでも同じバリデーション実施

### ページネーション

- カーソルベースページネーション使用
- `LoadNextPageProblemButton`で次ページ読み込み

### 認証

- 作成・編集・削除・投票・コメント・いいねは認証必須
- SessionContextで認証状態を確認

### SSR/CSR

- 一覧表示: サーバーコンポーネント（SSR）
- インタラクティブ部分: クライアントコンポーネント（CSR）
- "use client"ディレクティブを適切に配置

## 関連ドキュメント

各機能の詳細実装ガイド：

- **[投票機能](votes/CLAUDE.md)** - 投票・投票結果表示・ビジュアルエフェクト
- **[コメント機能](comments/CLAUDE.md)** - コメント投稿・返信・削除
- **[いいね機能](likes/CLAUDE.md)** - いいね追加・削除・カウント表示
