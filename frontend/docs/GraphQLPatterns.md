# GraphQL実装パターンガイド

## Apollo Client統合パターン

### 基本設定

Apollo Clientはファイルアップロード対応で設定済み：

```typescript
// src/lib/apollo/client.ts
import { createUploadLink } from "apollo-upload-client";

const uploadLink = createUploadLink({
  uri: `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
  credentials: "include",
});

export const apolloClient = new ApolloClient({
  link: uploadLink,
  cache: new InMemoryCache(),
});
```

### 標準的なuseMutationパターン

```typescript
import { useMutation, gql } from "@apollo/client";

const UPDATE_USER_MUTATION = gql`
  mutation UpdateUserProfile($input: UpdateUserInput!) {
    updateUser(input: $input) {
      user {
        id
        name
        profileText
        avatarUrl
      }
      errors
    }
  }
`;

function MyComponent() {
  const [updateUser, { loading }] = useMutation(UPDATE_USER_MUTATION);

  const handleSubmit = async formData => {
    const variables = {
      input: {
        name: formData.name,
        avatar: fileInput, // File オブジェクトを直接渡せる
      },
    };

    const result = await updateUser({ variables });

    if (result.data?.updateUser?.errors?.length > 0) {
      // エラーハンドリング
    } else {
      // 成功処理
    }
  };
}
```

### ファイルアップロード対応

- File オブジェクトを直接variables内に渡せる
- apollo-upload-clientが自動的にmultipart/form-dataに変換
- カスタムUploadTypeスカラーで処理

### エラーハンドリングパターン

```typescript
try {
  const result = await mutation({ variables });

  // GraphQLエラー（ビジネスロジックエラー）
  if (result.data?.mutationName?.errors?.length > 0) {
    errorToast({
      title: "操作に失敗しました",
      description: result.data.mutationName.errors.join(", "),
    });
    return;
  }

  // 成功処理
  if (result.data?.mutationName?.resource) {
    successToast({ title: "操作が完了しました" });
  }
} catch (error) {
  // ネットワークエラー・システムエラー
  errorToast({
    title: "通信エラー",
    description: "もう一度お試しください",
  });
}
```

## GraphQL vs REST使い分け

### GraphQL使用 ✅

- 何切る問題関連機能（既存実装）
- ユーザープロフィール管理
- ファイルアップロードが必要な機能
- リアルタイム更新が必要な機能

### REST継続使用 ❌→✅

- 認証・セッション管理（技術的複雑性のため）
- OAuth連携（外部API統合のため）
- 学習機能（開発停止中のため）

## 実装チェックリスト

### 新しいGraphQL機能追加時

1. **バックエンド**
   - [ ] GraphQL mutation/query実装
   - [ ] 適切なInput/Output型定義
   - [ ] ファイルアップロード必要ならUploadType使用
   - [ ] RSpecテスト作成

2. **フロントエンド**
   - [ ] GraphQLクエリファイル作成（.graphql）
   - [ ] useMutation/useQueryパターン使用
   - [ ] 共有Apollo Client使用（独自インスタンス作成禁止）
   - [ ] 適切なエラーハンドリング実装
   - [ ] ローディング状態管理

3. **品質保証**
   - [ ] TypeScript型チェック通過
   - [ ] ESLint通過
   - [ ] 動作確認

## 認証パターン（参考実装）

GraphQL認証は技術的に実装可能だが、本プロジェクトではREST認証継続を推奨。

### 認証GraphQL実装例

```typescript
// 認証リクエスト
const REQUEST_AUTH_MUTATION = gql`
  mutation RequestAuth($input: RequestAuthInput!) {
    requestAuth(input: $input) {
      success
      errors
      message
    }
  }
`;

const [requestAuth, { loading }] = useMutation(REQUEST_AUTH_MUTATION);

const handleAuthRequest = async (email: string) => {
  const result = await requestAuth({
    variables: { input: { email } },
  });

  if ((result.data as any)?.requestAuth?.success) {
    successToast({ title: "認証リクエストを送信しました" });
  }
};
```

### セッション管理の複雑性

```typescript
// 認証検証
const VERIFY_AUTH_MUTATION = gql`
  mutation VerifyAuth($input: VerifyAuthInput!) {
    verifyAuth(input: $input) {
      success
      errors
      user {
        id
        name
        email
      }
    }
  }
`;

// セッション状態管理が必要
const handleVerify = async (email: string, token: string) => {
  const result = await verifyAuth({
    variables: { input: { email, token } },
  });

  // 成功時のリダイレクト分岐
  if ((result.data as any)?.verifyAuth?.user) {
    router.push("/dashboard");
  } else {
    router.push("/users/new");
  }
};
```

## 移行時の注意点

### 既存REST→GraphQL移行

1. 段階的移行でリスク軽減
2. 既存機能の動作確認
3. 型安全性の確保
4. パフォーマンス影響確認

### 認証機能の移行判断

**REST継続推奨理由:**

- セッション管理の複雑性
- 既存実装の安定性
- エラーハンドリングの複雑化
- 移行コストとメリットの比較

### Apollo Client最適化

- キャッシュ戦略の適切な設定
- ファイルアップロード時のメモリ使用量考慮
- エラー処理統一
- 認証状態の管理方法選択

このパターンに従って、一貫性のあるGraphQL実装を維持してください。認証機能については既存RESTの継続使用を推奨し、新機能開発時のみGraphQL採用を検討してください。
