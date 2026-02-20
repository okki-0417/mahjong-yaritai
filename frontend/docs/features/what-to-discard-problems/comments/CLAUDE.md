# コメント機能 (Comments)

## 機能概要

何切る問題に対してコメントを投稿・返信・削除できる機能です。親コメントと子コメント（返信）の階層構造を持ち、ユーザー間のディスカッションを可能にします。

## コンポーネント構造

```
comments/
├── CommentsModal.tsx           # コメントモーダル（メインコンテナ）
├── CommentForm.tsx             # コメント投稿フォーム
├── ParentCommentCard.tsx       # 親コメント表示カード
├── ChildCommentCard.tsx        # 子コメント（返信）表示カード
├── DeleteCommentButton.tsx     # コメント削除ボタン
├── FetchRepliesButton.tsx      # 返信取得ボタン
└── CLAUDE.md                   # このファイル
```

## 主要コンポーネント

### CommentsModal

- **役割**: コメント機能のメインコンテナ
- **Props**:
  - `isOpen`: モーダル表示フラグ
  - `onClose`: モーダル閉じる関数
  - `problemId`: 問題ID
  - `parentComments`: 親コメント配列
  - `setParentComments`: 親コメント更新関数

#### 機能詳細

- React Hook Form統合（Zodバリデーション）
- 親コメント一覧表示
- コメント投稿フォーム配置
- 返信コメント挿入ロジック管理

#### 状態管理

```typescript
const [insertCommentToThread, setInsertCommentToThread] = useState<InsertCommentToThread>(
  () => comment => {
    setParentComments(prev => [...prev, comment]); // デフォルト: 親コメント追加
  },
);
const [replyingToComment, setReplyingToComment] = useState<Comment | null>(null);
```

### CommentForm

- **役割**: コメント投稿フォーム
- **Props**:
  - `problemId`: 問題ID
  - `register`: React Hook Form register
  - `handleSubmit`: フォーム送信ハンドラー
  - `errors`: バリデーションエラー
  - `resetField`: フィールドリセット関数
  - `isSubmitting`: 送信中フラグ
  - `insertCommentToThread`: コメント挿入関数
  - `replyingToComment`: 返信対象コメント
  - `setReplyingToComment`: 返信対象更新関数

#### 機能詳細

1. **認証チェック**
   - `SessionContext`でログイン状態確認
   - 未ログイン時はログインリンク表示

2. **返信機能**
   - 返信対象が設定されている場合、UI上に表示
   - `parent_comment_id`を隠しフィールドで送信
   - キャンセルボタンで返信状態をリセット

3. **フォームバリデーション**
   - 最大500文字（Zodスキーマ）
   - 必須入力チェック

### ParentCommentCard

- **役割**: 親コメント表示カード
- **Props**:
  - `parentComment`: 親コメントオブジェクト
  - `setValue`: React Hook Form setValue
  - `setFocus`: React Hook Form setFocus
  - `setInsertCommentToThread`: コメント挿入関数設定
  - `setReplyingToComment`: 返信対象設定

#### 機能詳細

1. **ユーザー情報表示**
   - アバター画像
   - ユーザー名（クリックでUserModal表示）
   - 投稿日時

2. **アクション**
   - 自分のコメント: 削除ボタン表示
   - 他人のコメント: 返信ボタン表示（ログイン時）

3. **返信表示**
   - `replies_count > 0`かつ返信未取得: 返信取得ボタン表示
   - 返信取得済み: 子コメント一覧表示

4. **返信処理**

```typescript
const handleReply = () => {
  setFocus("what_to_discard_problem_comment.content"); // フォームにフォーカス
  setValue("what_to_discard_problem_comment.parent_comment_id", String(parentComment.id));
  setReplyingToComment(parentComment);
  setInsertCommentToThread(() => reply => {
    setReplies(prev => [...prev, reply]); // 返信を子コメント配列に追加
  });
};
```

### ChildCommentCard

- **役割**: 子コメント（返信）表示カード
- **Props**:
  - `reply`: 返信コメントオブジェクト

#### 機能詳細

- 親コメントと同様の表示形式
- 左側に視覚的なインデント表示（縦線）
- 削除ボタン（自分のコメントのみ）

### DeleteCommentButton

- **役割**: コメント削除ボタン
- **Props**:
  - `comment`: コメントオブジェクト

#### 機能詳細

- 削除確認なし（即時削除）
- API呼び出し後、ページリロード
- エラーハンドリング

### FetchRepliesButton

- **役割**: 返信取得ボタン
- **Props**:
  - `setReplies`: 返信配列更新関数
  - `comment`: 親コメントオブジェクト

#### 機能詳細

- クリックで返信一覧を取得
- 取得中はローディング表示
- 取得後、返信一覧を表示

## API連携

### コメント関連エンドポイント

- `GET /what_to_discard_problems/:id/comments` - コメント一覧取得
  - Response: `{ what_to_discard_problem_comments: Comment[] }`

- `POST /what_to_discard_problems/:id/comments` - コメント投稿
  - Body: `{ what_to_discard_problem_comment: { content: string, parent_comment_id?: string } }`
  - Response: `{ what_to_discard_problem_comment: Comment }`

- `DELETE /what_to_discard_problems/:id/comments/:comment_id` - コメント削除
  - Response: `{ message: string }`

- `GET /what_to_discard_problems/:id/comments/:comment_id/replies` - 返信一覧取得
  - Response: `{ what_to_discard_problem_comment_replies: Comment[] }`

## 状態管理

### グローバル状態（SessionContext）

```typescript
const { session } = useContext(SessionContext);
const isLoggedIn = Boolean(session?.is_logged_in);
const myUserId = session?.user_id;
```

### ローカル状態（CommentsModal）

```typescript
// 親コメント配列
const [parentComments, setParentComments] = useState<Comment[] | null>(null);

// コメント挿入ロジック（動的に変更）
const [insertCommentToThread, setInsertCommentToThread] = useState<InsertCommentToThread>();

// 返信対象コメント
const [replyingToComment, setReplyingToComment] = useState<Comment | null>(null);
```

### ローカル状態（ParentCommentCard）

```typescript
// 返信配列
const [replies, setReplies] = useState<Comment[]>([]);
```

## コメント投稿フロー

### 親コメント投稿

```
1. CommentFormでテキスト入力
   ↓
2. parent_comment_id = null
   ↓
3. POST /comments
   ↓
4. insertCommentToThread(comment)
   → parentComments配列に追加
   ↓
5. フォームリセット
   ↓
6. 成功トースト表示
```

### 返信コメント投稿

```
1. ParentCommentCardで返信ボタンクリック
   ↓
2. handleReply()実行
   - setFocus: フォームにフォーカス
   - setValue: parent_comment_idセット
   - setReplyingToComment: 返信対象表示
   - setInsertCommentToThread: 挿入ロジック変更
   ↓
3. CommentFormでテキスト入力
   ↓
4. POST /comments (parent_comment_id付き)
   ↓
5. insertCommentToThread(reply)
   → replies配列に追加
   ↓
6. フォームリセット
   ↓
7. 成功トースト表示
```

## 返信表示フロー

```
1. ParentCommentCard表示
   ↓
2. replies_count > 0 && replies.length === 0
   → FetchRepliesButton表示
   ↓
3. ボタンクリック
   ↓
4. GET /comments/:id/replies
   ↓
5. setReplies(response)
   ↓
6. ChildCommentCard一覧表示
```

## UIスタイル

### 返信のインデント表示

```typescript
<HStack w="full" pl="4" h="24" gap="4">
  <Box w="1" h="full" className="bg-secondary" rounded="full" />
  <ChildCommentCard reply={reply} />
</HStack>
```

### ユーザーアバター

```typescript
<Circle size="8" overflow="hidden" border="1px">
  <Img
    src={comment.user.avatar_url || "/no-image.webp"}
    className="w-full h-full object-cover"
  />
</Circle>
```

### 日時表示

```typescript
<Text fontFamily="sans-serif" fontSize="xs">
  {new Date(comment.created_at).toLocaleString()}
</Text>
```

## バリデーション

### Zodスキーマ

```typescript
schemas.createComment_Body = {
  what_to_discard_problem_comment: {
    content: z.string().max(500, "コメントは500文字以内で入力してください"),
    parent_comment_id: z.string().nullable().optional(),
  },
};
```

## エラーハンドリング

### コメント投稿失敗

```typescript
try {
  const response = await apiClient.createComment(formData, { params: { ... } });
  // 成功処理
} catch (error) {
  errorToast({ error, title: "コメントを投稿できませんでした" });
}
```

### コメント削除失敗

```typescript
try {
  await apiClient.deleteComment([], { params: { ... } });
  window.location.reload();  // リロードで最新状態反映
} catch (error) {
  errorToast({ error, title: "コメントを削除できませんでした" });
}
```

### 返信取得失敗

```typescript
try {
  const response = await apiClient.getReplies({ params: { ... } });
  setReplies(response.what_to_discard_problem_comment_replies);
} catch (error) {
  errorToast({ error, title: "返信を取得できませんでした" });
}
```

## 開発時の注意点

### 認証

- 全てのコメント操作は認証必須
- `SessionContext`でログイン状態を確認
- 未ログイン時はログインリンクを表示

### コメント階層

- 親コメント（parent_comment_id = null）
- 子コメント（parent_comment_id = 親コメントID）
- 現状、孫コメントは非対応（2階層まで）

### 動的な挿入ロジック

- `insertCommentToThread`は状態に応じて動的に変更
- 親コメント投稿時: `parentComments`配列に追加
- 返信投稿時: 対応する`replies`配列に追加

### 削除後の処理

- 現状は`window.location.reload()`でページリロード
- よりスマートな実装: 削除後に配列から該当コメントを除去

### パフォーマンス

- 親コメントは初回モーダル表示時に取得
- 返信は個別に遅延取得（replies_count > 0の場合のみ）
