# 認証機能 (Authentication)

## 機能概要

パスワードレス認証（メールトークン認証）とソーシャルログイン（Google OAuth、LINE）を提供します。

## ディレクトリ構造

```
auth/
├── components/
│   ├── AuthRequestSection.tsx      # メール認証リクエストセクション
│   ├── SocialLoginSection.tsx      # ソーシャルログインセクション
│   └── SocialLoginButton.tsx       # Google/LINEログインボタン
├── request/
│   └── AuthRequestForm.tsx         # メールアドレス入力フォーム
├── verification/
│   └── AuthVerificationForm.tsx    # 6桁トークン入力フォーム
├── google-callback/
│   └── GoogleVerification.tsx      # Google OAuth コールバック処理
└── line-callback/
    └── LineVerification.tsx        # LINE OAuth コールバック処理
```

## 認証フロー

### 1. メールトークン認証

```
1. AuthRequestForm でメールアドレス入力
   ↓ POST /auth/request
2. メールで6桁トークン受信
   ↓
3. AuthVerificationForm でトークン入力
   ↓ POST /auth/verification
4. セッション確立・ログイン完了
```

### 2. Google OAuth認証

```
1. SocialLoginButton (Google) クリック
   ↓ GET /auth/google/login
2. Googleログイン画面へリダイレクト
   ↓
3. /auth/google/callback にリダイレクト
   ↓ POST /auth/google/callback
4. GoogleVerification でトークン処理
   ↓
5. セッション確立・ログイン完了
```

### 3. LINE認証

```
1. SocialLoginButton (LINE) クリック
   ↓ GET /auth/line/login_url
2. LINEログイン画面へリダイレクト
   ↓
3. /auth/line/callback にリダイレクト
   ↓ POST /auth/line/callback
4. LineVerification でトークン処理
   ↓
5. セッション確立・ログイン完了
```

## 主要コンポーネント

### AuthRequestForm

- **役割**: メールアドレス入力フォーム
- **バリデーション**: Zodスキーマ（メール形式）
- **API**: `POST /auth/request`
- **成功時**: `/auth/verification?email={email}` へ遷移

### AuthVerificationForm

- **役割**: 6桁トークン入力フォーム
- **Props**: `email` (クエリパラメータから取得)
- **API**: `POST /auth/verification`
- **成功時**: ホームページへリダイレクト

### SocialLoginButton

- **役割**: Google/LINEログインボタン
- **Props**:
  - `provider`: "google" | "line"
  - `onClick`: ログイン処理
- **機能**: プロバイダー別のアイコン・スタイル

### GoogleVerification / LineVerification

- **役割**: OAuth コールバック処理
- **機能**:
  - URLからトークン/コード取得
  - API呼び出し
  - セッション確立
  - エラーハンドリング

## API連携

### メールトークン認証

- `POST /auth/request` - メールにトークン送信
  - Body: `{ email: string }`
- `POST /auth/verification` - トークン検証
  - Body: `{ email: string, token: string }`

### Google OAuth

- `GET /auth/google/login` - Google認証URLを返す
- `POST /auth/google/callback` - コールバック処理
  - Body: `{ token: string }`

### LINE認証

- `GET /auth/line/login_url` - LINE認証URLを返す
- `POST /auth/line/callback` - コールバック処理
  - Body: `{ code: string, state: string }`

### セッション管理

- `GET /session` - 現在のセッション取得
- `DELETE /session` - ログアウト

## セッション管理

### AuthStateContext (グローバル)

- **場所**: `src/context-providers/AuthStateContextProvider.tsx`
- **提供値**:
  - `userId`: ログインユーザーID
  - `isLoggedIn`: ログイン状態
  - `isLoading`: 読み込み中フラグ
- **用途**: アプリ全体での認証状態管理

### セッション永続化

- Cookie ベースのセッション管理
- Redis バックエンド（有効期限: 1ヶ月）
- `httpOnly`, `secure` (本番環境)

## フォームバリデーション

### メールアドレス

```typescript
schemas.createAuthRequest_Body = {
  email: z.string().email(),
};
```

### トークン

```typescript
schemas.createAuthVerification_Body = {
  email: z.string().email(),
  token: z.string().length(6), // 6桁の数字
};
```

## ページルーティング

- `/auth/request` - メールアドレス入力
- `/auth/verification?email={email}` - トークン入力
- `/auth/google/callback?token={token}` - Google コールバック
- `/auth/line/callback?code={code}&state={state}` - LINE コールバック

## 開発時の注意点

### 認証状態の確認

- `AuthStateContext` を useContext で取得
- `isLoggedIn` でログイン状態をチェック
- 保護されたページでは認証ガード実装

### エラーハンドリング

- トークン期限切れ（15分）
- 無効なトークン
- OAuth コールバックエラー
- すべて `useErrorToast` でユーザーに通知

### リダイレクト

- ログイン成功: ホームページ (`/`)
- ログアウト成功: ログインページ (`/auth/request`)
- 認証エラー: エラーメッセージ表示後、入力画面に留まる

### 環境変数

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

### セキュリティ

- トークンはURLパラメータで渡さない（POSTボディ使用）
- CSRF対策: SameSite Cookie
- HTTPS必須（本番環境）

### OAuth フロー

1. バックエンドから認証URLを取得
2. `window.location.href` でリダイレクト
3. コールバックページでトークン/コード処理
4. セッション確立後、ホームへリダイレクト
