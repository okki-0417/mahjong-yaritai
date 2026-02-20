# 投票機能 (Votes)

## 機能概要

何切る問題に対してユーザーが牌を選んで投票し、投票結果を視覚的に表示する機能です。最多・最少投票牌には特殊エフェクト（炎・雪）が表示されます。

## コンポーネント構造

```
votes/
├── VoteButton.tsx              # 投票ボタン（牌単位）
├── ProblemVoteSection.tsx      # 投票結果表示セクション
└── CLAUDE.md                   # このファイル
```

## 主要コンポーネント

### VoteButton

- **役割**: 各牌に対する投票ボタン
- **Props**:
  - `problem`: 問題オブジェクト
  - `tileId`: 牌ID
  - `myVoteTileId`: 自分の投票済み牌ID
  - `setMyVoteTileId`: 投票状態更新関数
  - `setVotesCount`: 投票数更新関数
  - `voteResult`: 投票結果配列
  - `setVoteResult`: 投票結果更新関数

#### 機能詳細

1. **投票状態の管理**
   - 未投票: 新規投票可能
   - 投票済み（同じ牌）: 投票取り消し可能
   - 投票済み（別の牌）: 投票変更（削除→作成）

2. **ビジュアルエフェクト**
   - **炎エフェクト（FireImage）**: 最多投票牌（2枚以下）
   - **雪エフェクト（ColdImage）**: 最少投票牌（2枚以下）
   - エフェクト表示条件:
     - 最多・最少の票数が異なる
     - 該当牌が2枚以下

3. **認証チェック**
   - `SessionContext`でログイン状態確認
   - 未ログイン時は`NotLoggedInModal`表示

### ProblemVoteSection

- **役割**: 投票結果表示セクション
- **Props**:
  - `isVoted`: 投票済みフラグ
  - `votesCount`: 総投票数
  - `setVoteResult`: 投票結果更新関数
  - `problem`: 問題オブジェクト
  - `handleDisplayVoteResult`: 結果表示ハンドラー

#### 機能詳細

- 投票アイコン表示（投票済み: 青、未投票: グレー）
- クリックで投票結果取得
- 重複牌の排除処理（tile_idベース）

## API連携

### 投票関連エンドポイント

- `POST /what_to_discard_problems/:id/votes/my_vote` - 投票
  - Body: `{ what_to_discard_problem_my_vote: { tile_id: number } }`
  - Response: `{ what_to_discard_problem_my_vote: { tile: Tile } }`

- `DELETE /what_to_discard_problems/:id/votes/my_vote` - 投票取り消し
  - Response: `{ message: string }`

- `GET /what_to_discard_problems/:id/votes/result` - 投票結果取得
  - Response: `{ what_to_discard_problem_vote_result: Array<{ tile_id: number, count: number }> }`

## 状態管理

### ローカル状態（VoteButton）

```typescript
const [isSubmitting, setIsSubmitting] = useState(false); // 送信中フラグ
```

### グローバル状態（SessionContext）

```typescript
const { session } = useContext(SessionContext);
const isLoggedIn = Boolean(session?.is_logged_in);
```

### Props経由の状態

- `myVoteTileId`: 親コンポーネントで管理
- `voteResult`: 投票結果（親で管理）
- `votesCount`: 総投票数（親で管理）

## 投票フロー

### 新規投票

```
1. VoteButtonクリック
   ↓
2. ログイン確認
   ↓
3. POST /votes/my_vote
   ↓
4. votesCount++
5. myVoteTileIdを更新
   ↓
6. GET /votes/result（最新結果取得）
   ↓
7. voteResult更新
   ↓
8. 成功トースト表示
```

### 投票取り消し

```
1. 投票済み牌をクリック
   ↓
2. DELETE /votes/my_vote
   ↓
3. votesCount--
4. myVoteTileIdをnullに設定
   ↓
5. GET /votes/result
   ↓
6. voteResult更新
   ↓
7. 成功トースト表示
```

### 投票変更

```
1. 投票済み以外の牌をクリック
   ↓
2. DELETE /votes/my_vote（旧投票削除）
   ↓
3. POST /votes/my_vote（新投票作成）
   ↓
4. myVoteTileId更新
   ↓
5. GET /votes/result
   ↓
6. voteResult更新
   ↓
7. 成功トースト表示
```

## ビジュアルエフェクト

### HotColdEffect コンポーネント

```typescript
// 最多投票牌の判定
const mostVotedCount = Math.max(...voteResult.map(vote => vote.count));
const mostVotedTileIds = voteResult
  .filter(vote => vote.count == mostVotedCount)
  .map(vote => vote.tile_id);

// 炎エフェクト表示条件
if (mostVotedTileIds.length <= 2 && mostVotedTileIds.includes(tileId)) {
  // FireImage表示 + firing-tile CSSクラス
}

// 雪エフェクト表示条件
if (leastVotedTileIds.length <= 2 && leastVotedTileIds.includes(tileId)) {
  // ColdImage表示 + frozen-tile CSSクラス
}
```

### エフェクトアセット

- `/public/fire.gif` - 炎アニメーション
- `/public/snow.gif` - 雪アニメーション
- `/public/vote-icon-default.webp` - 投票アイコン（グレー）
- `/public/vote-icon-blue.webp` - 投票アイコン（青）

## UIスタイル

### 投票済み牌の表示

```typescript
<Box
  position="absolute"
  inset="0"
  zIndex="10"
  className={`${myVoteTileId == tileId && "selected-tile"}`}
/>
```

### 送信中のフォールバック

```typescript
const VotingFallback = () => (
  <Box position="absolute" inset="0" zIndex="5" rounded="sm">
    <Skeleton w="full" h="full" />
  </Box>
);
```

## エラーハンドリング

### 投票操作失敗時

```typescript
try {
  // 投票処理
} catch (error) {
  errorToast({ error, title: "投票の操作に失敗しました" });
} finally {
  setIsSubmitting(false);
}
```

### 投票結果取得失敗時

```typescript
try {
  // 結果取得処理
} catch (error) {
  errorToast({ title: "投票の取得に失敗しました", error });
}
```

## 開発時の注意点

### 認証

- 全ての投票操作は認証必須
- `SessionContext`でログイン状態を確認
- 未ログイン時は`NotLoggedInModal`表示

### 状態の同期

- 投票後は必ず最新の投票結果を取得
- 親コンポーネントの状態を適切に更新

### パフォーマンス

- `isSubmitting`フラグで多重送信を防止
- エフェクト表示は最大2枚までに制限

### 牌の重複排除

```typescript
const tileUniqueResult = Array.from(
  new Map(
    response.what_to_discard_problem_vote_result.map(result => [result.tile_id, result]),
  ).values(),
);
```

### ドラ牌のハイライト

```typescript
<TileImage tileId={tileId} isShiny={tileId == problem.dora_id} />
```
