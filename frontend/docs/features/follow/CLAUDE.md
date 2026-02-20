# フォロー機能 (Follow)

## 機能概要

ユーザー同士がフォロー・フォロー解除できる機能です。ユーザープロフィールページや各種カード（コメント、問題など）で表示されるフォローボタンから操作できます。

## ディレクトリ構造

### ドキュメント

```
docs/features/follow/
└── CLAUDE.md  # このファイル
```

### コードベース

```
src/
├── components/
│   ├── FollowButton.tsx           # フォローボタンコンポーネント
│   ├── UserProfile.tsx            # ユーザープロフィール（フォローボタン含む）
│   └── Modals/
│       └── UserModal.tsx          # ユーザーモーダル（フォローボタン含む）
├── app/
│   ├── users/[id]/
│   │   └── UserProfileSection.tsx # ユーザープロフィールセクション
│   └── what-to-discard-problems/
│       └── components/
│           ├── ProblemCardHeader.tsx     # 問題カードヘッダー（フォローボタン含む）
│           └── comments/
│               ├── ParentCommentCard.tsx # 親コメントカード（フォローボタン含む）
│               └── ChildCommentCard.tsx  # 子コメントカード（フォローボタン含む）
└── zodios/
    └── api.ts                     # API定義（createFollow, deleteFollow）
```

## 主要コンポーネント

### FollowButton

**パス**: `src/components/FollowButton.tsx`

- **役割**: フォロー/フォロー解除を制御する再利用可能なボタンコンポーネント
- **Props**:
  - `userId`: number - フォロー対象のユーザーID
  - `initialIsFollowing`: boolean - 初期フォロー状態
  - `currentUserId`: number | null - ログイン中のユーザーID
  - `variant?`: "solid" | "outline" - ボタンスタイル（デフォルト: "solid"）
  - `size?`: "sm" | "md" | "lg" - ボタンサイズ（デフォルト: "md"）

#### 機能詳細

1. **フォロー状態管理**

   ```typescript
   const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
   const [isLoading, setIsLoading] = useState(false);
   ```

2. **認証チェック**
   - ログインしていない場合: `/auth/login` にリダイレクト
   - 自分自身の場合: ボタンを非表示（`return null`）

3. **フォロー/フォロー解除処理**

   ```typescript
   const handleFollow = async () => {
     if (!currentUserId) {
       router.push("/auth/login");
       return;
     }

     if (currentUserId === userId) {
       return;
     }

     setIsLoading(true);

     try {
       if (isFollowing) {
         await apiClient.deleteFollow({ params: { user_id: String(userId) } });
         setIsFollowing(false);
       } else {
         await apiClient.createFollow({ params: { user_id: String(userId) } });
         setIsFollowing(true);
       }
     } catch (error) {
       console.error("Failed to toggle follow:", error);
     } finally {
       setIsLoading(false);
     }
   };
   ```

4. **UIスタイル**
   - フォロー中: グレー配色、テキスト「フォロー中」
   - 未フォロー: ティール配色、テキスト「フォロー」
   - ローディング状態: ボタン無効化

### UserProfile

**パス**: `src/components/UserProfile.tsx`

- **役割**: ユーザープロフィール表示とフォローボタンを含むコンポーネント
- **Props**:
  - `user`: User型 - ユーザー情報
  - `isFollowing?`: boolean - フォロー状態（デフォルト: false）
  - `currentUserId?`: number | null - ログイン中のユーザーID（デフォルト: null）

#### レイアウト

```typescript
<VStack gap="4" align="stretch">
  <VStack spacing={4}>
    <Circle size={["150", "200"]} overflow="hidden">
      <Image src={user?.avatar_url || "/no-image.webp"} ... />
    </Circle>

    <Box textAlign="center" maxW="md" mx="auto">
      <Text fontSize={["2xl", "4xl"]}>{user?.name}</Text>
    </Box>

    <FollowButton
      userId={user.id}
      initialIsFollowing={isFollowing}
      currentUserId={currentUserId}
      size="lg"
    />

    <Box>
      <Text>{user?.profile_text || "自己紹介文が設定されていません"}</Text>
    </Box>
  </VStack>
</VStack>
```

### UserProfileSection

**パス**: `src/app/users/[id]/UserProfileSection.tsx`

- **役割**: サーバーサイドでユーザー情報とフォロー状態を取得し、UserProfileに渡す
- **Props**:
  - `id`: string - ユーザーID（URLパラメータ）

#### データ取得

```typescript
const apiPageClient = await createApiPageClient();

const [userResponse, sessionResponse] = await Promise.all([
  apiPageClient.getUser({ params: { id } }),
  apiPageClient.getSession(),
]);

return (
  <UserProfile
    user={userResponse.user}
    isFollowing={userResponse.user.is_following}
    currentUserId={sessionResponse.session.user_id}
  />
);
```

## API連携

### フォロー関連エンドポイント

#### フォロー作成

- **エンドポイント**: `POST /users/:user_id/follow`
- **エイリアス**: `createFollow`
- **パラメータ**:
  - `user_id`: string (Path)
- **レスポンス**:
  ```typescript
  {
    message: string;
  }
  ```
- **エラー**:
  - `401 unauthorized`: 認証が必要
  - `422 unprocessable entity`: バリデーションエラー（自分自身をフォロー、重複フォローなど）

#### フォロー解除

- **エンドポイント**: `DELETE /users/:user_id/follow`
- **エイリアス**: `deleteFollow`
- **パラメータ**:
  - `user_id`: string (Path)
- **レスポンス**:
  ```typescript
  {
    message: string;
  }
  ```
- **エラー**:
  - `401 unauthorized`: 認証が必要
  - `404 not found`: フォロー関係が見つからない

### API定義（Zodios）

**パス**: `src/zodios/api.ts`

```typescript
{
  method: "post",
  path: "/users/:user_id/follow",
  alias: "createFollow",
  requestFormat: "json",
  parameters: [
    {
      name: "user_id",
      type: "Path",
      schema: z.string(),
    },
  ],
  response: z.object({ message: z.string() }).partial().passthrough(),
  errors: [...]
},
{
  method: "delete",
  path: "/users/:user_id/follow",
  alias: "deleteFollow",
  requestFormat: "json",
  parameters: [
    {
      name: "user_id",
      type: "Path",
      schema: z.string(),
    },
  ],
  response: z.object({ message: z.string() }).partial().passthrough(),
  errors: [...]
}
```

## 状態管理

### ローカル状態（FollowButton内）

```typescript
const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
const [isLoading, setIsLoading] = useState(false);
```

- **isFollowing**: フォロー状態を管理
- **isLoading**: API通信中のローディング状態

### サーバーサイド状態（UserProfileSection）

```typescript
const userResponse = await apiPageClient.getUser({ params: { id } });
// userResponse.user.is_following にフォロー状態が含まれる
```

## フォローフロー

### フォロー操作（現状実装）

```
1. ユーザーが「フォロー」ボタンをクリック
   ↓
2. 認証チェック
   - 未ログイン → /auth/login にリダイレクト
   - 自分自身 → 処理中断
   ↓
3. ローディング状態開始（isLoading = true）
   ↓
4. API呼び出し（POST /users/:user_id/follow）
   ↓
5. 成功時
   - isFollowing = true に更新
   - ボタンテキスト「フォロー中」に変更
   - ボタン色グレーに変更
   ↓
6. ローディング状態終了（isLoading = false）
```

### フォロー操作（推奨実装：未ログインモーダル使用）

```
1. ユーザーが「フォロー」ボタンをクリック
   ↓
2. 認証チェック
   - 未ログイン → NotLoggedInModalを表示
   - 自分自身 → 処理中断
   ↓
3. ローディング状態開始（isLoading = true）
   ↓
4. API呼び出し（POST /users/:user_id/follow）
   ↓
5. 成功時
   - isFollowing = true に更新
   - ボタンテキスト「フォロー中」に変更
   - ボタン色グレーに変更
   ↓
6. ローディング状態終了（isLoading = false）
```

### フォロー解除操作

```
1. ユーザーが「フォロー中」ボタンをクリック
   ↓
2. ローディング状態開始（isLoading = true）
   ↓
3. API呼び出し（DELETE /users/:user_id/follow）
   ↓
4. 成功時
   - isFollowing = false に更新
   - ボタンテキスト「フォロー」に変更
   - ボタン色ティールに変更
   ↓
5. ローディング状態終了（isLoading = false）
```

## 使用箇所

### 1. ユーザープロフィールページ

**パス**: `src/app/users/[id]/page.tsx`

```typescript
<UserProfileSection id={params.id} />
```

- サーバーサイドでフォロー状態を取得
- 大きいサイズのフォローボタン表示

### 2. ユーザーモーダル

**パス**: `src/components/Modals/UserModal.tsx`

- モーダル内でユーザー情報とフォローボタンを表示

### 3. 問題カードヘッダー

**パス**: `src/app/what-to-discard-problems/components/ProblemCardHeader.tsx`

- 問題投稿者の情報とフォローボタンを表示

### 4. コメントカード

**パス**: `src/app/what-to-discard-problems/components/comments/`

- `ParentCommentCard.tsx`: 親コメント投稿者のフォローボタン
- `ChildCommentCard.tsx`: 子コメント投稿者のフォローボタン

## UIスタイル

### ボタンスタイル

```typescript
<Button
  onClick={handleFollow}
  isLoading={isLoading}
  colorScheme={isFollowing ? "gray" : "teal"}
  variant={variant}  // "solid" または "outline"
  size={size}>       // "sm", "md", または "lg"
  {isFollowing ? "フォロー中" : "フォロー"}
</Button>
```

### サイズバリエーション

- **lg**: ユーザープロフィールページ
- **md**: デフォルトサイズ（モーダル、カードなど）
- **sm**: 小さいコンテキスト

### バリアントバリエーション

- **solid**: デフォルト（塗りつぶし）
- **outline**: アウトライン（コンパクトな表示に適している）

## 開発時の注意点

### 認証

- **未ログイン時の処理**:
  - **現状**: ログインページにリダイレクト

    ```typescript
    if (!currentUserId) {
      router.push("/auth/login");
      return;
    }
    ```

  - **推奨実装**: 未ログインモーダルを表示（他の機能と統一）

    ```typescript
    // NotLoggedInModalを使用する実装例
    import { useDisclosure } from "@chakra-ui/react";
    import NotLoggedInModal from "@/src/components/Modals/NotLoggedInModal";

    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleFollow = async () => {
      if (!currentUserId) {
        onOpen();  // モーダルを表示
        return;
      }
      // フォロー処理...
    };

    return (
      <>
        <Button onClick={handleFollow}>...</Button>
        <NotLoggedInModal isOpen={isOpen} onClose={onClose} />
      </>
    );
    ```

    **参考実装**: `src/app/what-to-discard-problems/components/likes/ProblemLikeSection.tsx`

- **自分自身のフォロー防止**: ボタンを非表示
  ```typescript
  if (currentUserId === userId) {
    return null;
  }
  ```

### エラーハンドリング

- **現状**: エラーはコンソールに出力のみ

  ```typescript
  catch (error) {
    console.error("Failed to toggle follow:", error);
  }
  ```

- **改善案**: トースト通知でユーザーにエラーを伝える実装も検討可能

### パフォーマンス

- **楽観的UI更新**: API成功前に即座に状態を更新
  - ユーザー体験向上
  - API失敗時は状態ロールバックも検討可能

### API型安全性

- **Zodiosによる型安全性**: APIレスポンスは自動的に型推論される
  ```typescript
  await apiClient.createFollow({ params: { user_id: String(userId) } });
  // ↑ Zodスキーマに基づいた型チェック
  ```

### サーバーサイドデータ取得

- **並列取得**: ユーザー情報とセッション情報を同時取得

  ```typescript
  const [userResponse, sessionResponse] = await Promise.all([
    apiPageClient.getUser({ params: { id } }),
    apiPageClient.getSession(),
  ]);
  ```

- **フォロー状態の含有**: `getUser` APIのレスポンスに `is_following` が含まれる
  - バックエンドで現在のユーザーとの関係を判定
  - フロントエンドは追加のAPI呼び出し不要

## フォロー機能の拡張

### 今後の実装候補

1. **フォロワー/フォロー中一覧ページ**
   - `/users/:id/followers` - フォロワー一覧
   - `/users/:id/following` - フォロー中一覧

2. **通知機能**
   - フォローされた時の通知

3. **フォロー状態の即時反映**
   - WebSocketやServer-Sent Eventsでリアルタイム更新

4. **バルクフォロー/フォロー解除**
   - 複数ユーザーをまとめてフォロー

5. **フォロー数の表示**
   - プロフィールにフォロワー数/フォロー中数を表示
