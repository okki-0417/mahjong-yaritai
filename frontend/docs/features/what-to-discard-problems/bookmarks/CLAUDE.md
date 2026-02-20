# お気に入り機能 (Bookmarks)

## 機能概要

何切る問題に対してユーザーが「お気に入り」登録・解除できる機能です。お気に入り登録した問題は後からまとめて確認でき、学習や復習に活用できます。

## コンポーネント構造

```
bookmarks/
├── ProblemBookmarkSection.tsx  # お気に入りセクション（メインコンポーネント）
├── BookmarkButton.tsx          # お気に入りボタン（共通コンポーネント）
└── CLAUDE.md                   # このファイル
```

## 主要コンポーネント

### ProblemBookmarkSection

- **役割**: お気に入り機能のメインコンポーネント
- **配置**: ProblemCardの下部、いいねボタンの隣
- **Props**:
  - `problem`: 問題オブジェクト（WhatToDiscardProblem型）
  - `initialIsBookmarked`: 初期お気に入り状態

#### 機能詳細

1. **お気に入り状態の取得**
   - GraphQLクエリで問題詳細と共に取得
   - `isBookmarkedByMe`フィールドで自分のお気に入り状態を確認
   - 初期値は`problem.is_bookmarked_by_me`を使用

2. **お気に入り追加・削除**
   - お気に入り済み: `deleteWhatToDiscardProblemBookmark`ミューテーション
   - 未登録: `createWhatToDiscardProblemBookmark`ミューテーション
   - カウント数をローカル状態で即座に更新（楽観的更新）

3. **認証チェック**
   - `SessionContext`でログイン状態確認
   - 未ログイン時は`NotLoggedInModal`を表示

4. **UI表示**
   - ブックマークアイコン（お気に入り済み: 塗りつぶし、未登録: 輪郭のみ）
   - お気に入り数の表示
   - ホバー時のツールチップ表示

### BookmarkButton

- **役割**: 再利用可能なお気に入りボタンコンポーネント
- **Props**:
  - `problemId`: 問題ID
  - `isBookmarked`: お気に入り状態
  - `bookmarksCount`: お気に入り数
  - `size`: ボタンサイズ（"sm" | "md" | "lg"）
  - `showCount`: カウント表示の有無

## GraphQL連携

### スキーマ定義

```graphql
# お気に入り登録状態の取得
type WhatToDiscardProblem {
  id: ID!
  # ... 他のフィールド
  isBookmarkedByMe: Boolean!
  bookmarksCount: Int!
}

# お気に入り作成
mutation CreateWhatToDiscardProblemBookmark($problemId: ID!) {
  createWhatToDiscardProblemBookmark(input: { problemId: $problemId }) {
    bookmark {
      id
      problemId
      userId
      createdAt
    }
    success
    errors
  }
}

# お気に入り削除
mutation DeleteWhatToDiscardProblemBookmark($problemId: ID!) {
  deleteWhatToDiscardProblemBookmark(input: { problemId: $problemId }) {
    success
    errors
  }
}

# お気に入り問題一覧取得
query GetBookmarkedProblems($cursor: String, $limit: Int) {
  bookmarkedProblems(cursor: $cursor, limit: $limit) {
    problems {
      id
      # ... 問題のフィールド
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

### GraphQLドキュメント

```graphql
# src/graphql/createWhatToDiscardProblemBookmark.graphql
mutation CreateWhatToDiscardProblemBookmark($problemId: ID!) {
  createWhatToDiscardProblemBookmark(input: { problemId: $problemId }) {
    bookmark {
      id
      problemId
      userId
      createdAt
    }
    success
    errors
  }
}

# src/graphql/deleteWhatToDiscardProblemBookmark.graphql
mutation DeleteWhatToDiscardProblemBookmark($problemId: ID!) {
  deleteWhatToDiscardProblemBookmark(input: { problemId: $problemId }) {
    success
    errors
  }
}

# src/graphql/bookmarkedProblems.graphql
query BookmarkedProblems($cursor: String, $limit: Int) {
  bookmarkedProblems(cursor: $cursor, limit: $limit) {
    problems {
      id
      round
      turn
      wind
      points
      description
      votesCount
      commentsCount
      likesCount
      bookmarksCount
      isBookmarkedByMe
      createdAt
      user {
        id
        name
        avatarUrl
      }
      # ... 牌のフィールド
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

## 状態管理

### ローカル状態

- `isBookmarked`: 現在のお気に入り状態
- `bookmarksCount`: お気に入り数
- `isLoading`: 処理中フラグ

### 楽観的更新

1. ボタンクリック時に即座にUIを更新
2. APIリクエストをバックグラウンドで実行
3. エラー時は元の状態にロールバック

## UI/UX設計

### ボタンデザイン

- **未登録時**: 輪郭のみのブックマークアイコン（gray.400）
- **登録済み**: 塗りつぶしブックマークアイコン（yellow.500）
- **ホバー時**: スケールアップアニメーション
- **ローディング時**: スピナー表示

### 配置

- ProblemCard内: いいねボタンの右側
- 問題一覧: 各カードの下部
- 問題詳細: アクションバー内

### トースト通知

- **登録成功**: "お気に入りに追加しました"
- **解除成功**: "お気に入りを解除しました"
- **エラー時**: エラー内容を表示

## 実装手順

### 1. GraphQLスキーマの追加（バックエンド）

- [ ] `is_bookmarked_by_me`フィールド追加
- [ ] `bookmarks_count`フィールド追加
- [ ] ミューテーション実装

### 2. GraphQLドキュメント作成（フロントエンド）

- [ ] `createWhatToDiscardProblemBookmark.graphql`
- [ ] `deleteWhatToDiscardProblemBookmark.graphql`
- [ ] `bookmarkedProblems.graphql`

### 3. コンポーネント実装

- [ ] `BookmarkButton.tsx`共通コンポーネント
- [ ] `ProblemBookmarkSection.tsx`メインコンポーネント
- [ ] ProblemCardへの統合

### 4. お気に入り一覧ページ

- [ ] `/me/bookmarks`ページ作成
- [ ] ページネーション実装
- [ ] フィルター・ソート機能

## エラーハンドリング

### 認証エラー

- 未ログイン時: NotLoggedInModalを表示
- セッション切れ: 再ログインを促す

### APIエラー

- ネットワークエラー: リトライボタン表示
- サーバーエラー: エラートースト表示
- 楽観的更新のロールバック

## パフォーマンス最適化

### キャッシュ戦略

- Apollo Clientのキャッシュ活用
- お気に入り状態をローカルにキャッシュ
- refetchQueriesで関連クエリ更新

### バッチ処理

- 複数のお気に入り操作をまとめて実行
- デバウンス処理で連続クリック対策

## テスト項目

### 単体テスト

- [ ] BookmarkButtonのレンダリング
- [ ] お気に入り状態の切り替え
- [ ] 認証チェックロジック

### 統合テスト

- [ ] GraphQLミューテーションの実行
- [ ] エラーハンドリング
- [ ] 楽観的更新とロールバック

### E2Eテスト

- [ ] お気に入り登録・解除フロー
- [ ] お気に入り一覧の表示
- [ ] ページネーション

## セキュリティ考慮事項

- 認証必須のミューテーション
- ユーザーごとのお気に入り管理
- レート制限の実装

## 今後の拡張案

1. **お気に入りフォルダ機能**
   - カテゴリ分けして整理
   - カスタムタグ付け

2. **共有機能**
   - お気に入りリストの共有
   - 公開/非公開設定

3. **学習機能との連携**
   - お気に入り問題から学習セット作成
   - 復習スケジュール管理

4. **統計情報**
   - お気に入り問題の傾向分析
   - 学習進捗トラッキング
