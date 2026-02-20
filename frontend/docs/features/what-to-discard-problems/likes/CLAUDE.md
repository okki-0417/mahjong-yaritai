# いいね機能 (Likes)

## 機能概要

何切る問題に対してユーザーが「いいね」を追加・削除できる機能です。いいね状態とカウント数をリアルタイムで表示します。

## コンポーネント構造

```
likes/
├── ProblemLikeSection.tsx      # いいねセクション（メインコンポーネント）
└── CLAUDE.md                   # このファイル
```

## 主要コンポーネント

### ProblemLikeSection

- **役割**: いいね機能のメインコンポーネント
- **Props**:
  - `problem`: 問題オブジェクト（WhatToDiscardProblem型）

#### 機能詳細

1. **いいね状態の取得**
   - コンポーネントマウント時にAPI呼び出し
   - `GET /what_to_discard_problems/:id/likes/my_like`で自分のいいね状態を取得
   - 初期値は`problem.is_liked_by_me`を使用

2. **いいね追加・削除**
   - いいね済み: `DELETE /my_like`でいいね削除
   - 未いいね: `POST /my_like`でいいね追加
   - カウント数をローカル状態で即座に更新

3. **認証チェック**
   - `SessionContext`でログイン状態確認
   - 未ログイン時は`NotLoggedInModal`表示

4. **UI表示**
   - 共有コンポーネント`LikeButton`を使用
   - ハートアイコン（いいね済み: 塗りつぶし、未いいね: 輪郭のみ）
   - いいね数の表示

## API連携

### いいね関連エンドポイント

- `GET /what_to_discard_problems/:id/likes/my_like` - 自分のいいね取得
  - Response: `{ my_like: Like | null }`

- `POST /what_to_discard_problems/:id/likes/my_like` - いいね追加
  - Body: `[]` (空配列)
  - Response: `{ message: string }`

- `DELETE /what_to_discard_problems/:id/likes/my_like` - いいね削除
  - Body: `[]` (空配列)
  - Response: `{ message: string }`

## 状態管理

### ローカル状態

```typescript
const [isLiked, setIsLiked] = useState(Boolean(problem.is_liked_by_me));
const [likesCount, setLikesCount] = useState(problem.likes_count);
const [isSubmitting, setIsSubmitting] = useState(false);
```

### グローバル状態（SessionContext）

```typescript
const { session } = useContext(SessionContext);
const isLoggedIn = Boolean(session?.is_logged_in);
```

## いいねフロー

### いいね追加

```
1. LikeButtonクリック
   ↓
2. ログイン確認
   未ログイン → NotLoggedInModal表示
   ↓
3. isSubmittingチェック（多重送信防止）
   ↓
4. POST /likes/my_like
   ↓
5. isLiked = true
6. likesCount++
   ↓
7. 成功トースト表示
   ↓
8. isSubmitting = false
```

### いいね削除

```
1. LikeButtonクリック
   ↓
2. ログイン確認
   ↓
3. isSubmittingチェック
   ↓
4. DELETE /likes/my_like
   ↓
5. isLiked = false
6. likesCount--
   ↓
7. 成功トースト表示
   ↓
8. isSubmitting = false
```

## 初期化フロー

```
1. コンポーネントマウント
   ↓
2. useEffect実行
   ↓
3. GET /likes/my_like
   ↓
4. レスポンスに応じてisLikedを設定
   - my_like存在 → isLiked = true
   - my_like null → isLiked = false
   ↓
5. エラー時 → isLiked = false
```

## コンポーネント実装

### useEffect（初期化）

```typescript
useEffect(() => {
  const fetchMyLike = async () => {
    if (!problem.id) return;

    try {
      const response = await apiClient.getWhatToDiscardProblemMyLike({
        params: { what_to_discard_problem_id: String(problem.id) },
      });
      setIsLiked(Boolean(response.my_like));
    } catch {
      setIsLiked(false);
    }
  };

  fetchMyLike();
}, [problem.id]);
```

### いいね操作ハンドラー

```typescript
const handleClick = async () => {
  if (!isLoggedIn) return onOpen(); // 未ログイン時モーダル表示
  if (isSubmitting) return null; // 多重送信防止
  setIsSubmitting(true);

  try {
    if (isLiked) {
      await apiClient.deleteWhatToDiscardProblemMyLike([], {
        params: { what_to_discard_problem_id: String(problem.id) },
      });
      setIsLiked(false);
      setLikesCount(prev => prev - 1);
      successToast({ title: "いいねを取り消しました" });
    } else {
      await apiClient.createWhatToDiscardProblemMyLike([], {
        params: { what_to_discard_problem_id: String(problem.id) },
      });
      setIsLiked(true);
      setLikesCount(prev => prev + 1);
      successToast({ title: "いいねしました" });
    }
  } catch (error) {
    errorToast({ error, title: "いいねの操作に失敗しました" });
  } finally {
    setIsSubmitting(false);
  }

  return null;
};
```

## 共有コンポーネント

### LikeButton

- **場所**: `@/src/components/LikeButton`
- **Props**:
  - `isLiked`: いいね状態（boolean）
  - `likeCount`: いいね数（number）
  - `handleClick`: クリックハンドラー
  - `isLoading`: 送信中フラグ（boolean）

#### UI表示

- ハートアイコン（react-icons）
- いいね数のテキスト表示
- ローディング時のスピナー表示

## エラーハンドリング

### いいね操作失敗

```typescript
catch (error) {
  errorToast({ error, title: "いいねの操作に失敗しました" });
} finally {
  setIsSubmitting(false);  // 必ず送信フラグをリセット
}
```

### 初期取得失敗

```typescript
catch {
  setIsLiked(false);  // エラー時は未いいね状態にフォールバック
}
```

## 開発時の注意点

### 認証

- 全てのいいね操作は認証必須
- `SessionContext`でログイン状態を確認
- 未ログイン時は`NotLoggedInModal`表示

### 状態の初期化

- `problem.is_liked_by_me`を初期値として使用
- コンポーネントマウント時にAPI呼び出しで最新状態を取得
- APIエラー時は`false`にフォールバック

### パフォーマンス

- `isSubmitting`フラグで多重送信を防止
- 状態更新は楽観的更新（APIレスポンス前に即座に反映）

### リアルタイム性

- 初期表示: `problem.is_liked_by_me`（SSR時のデータ）
- マウント後: API呼び出しで最新状態取得
- 操作後: ローカル状態を即座に更新

### 楽観的更新の注意点

- API失敗時も状態が更新されてしまう
- エラー時は状態をロールバックする実装も検討可能
- 現状はエラートーストで通知のみ
