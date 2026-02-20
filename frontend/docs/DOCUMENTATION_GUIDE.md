# フロントエンドドキュメント作成ガイド

このガイドは、フロントエンドの機能ごとにCLAUDE.mdドキュメントを作成する際の標準化されたマニュアルです。

## ドキュメント配置の原則

### 1. 機能ベースのディレクトリ構造

ページごとではなく、**機能ごと**にドキュメントを作成します。

**すべてのドキュメントは `frontend/docs/features/` ディレクトリに集約されます。**

```
docs/
├── DOCUMENTATION_GUIDE.md           # このファイル
└── features/
    └── [feature-name]/
        ├── CLAUDE.md                # メイン機能のドキュメント
        ├── [sub-feature-1]/
        │   └── CLAUDE.md            # サブ機能のドキュメント
        └── [sub-feature-2]/
            └── CLAUDE.md
```

対応するコードベースの構造：

```
src/app/
└── [feature-name]/
    ├── page.tsx
    ├── components/
    ├── context-providers/
    ├── [sub-feature-1]/
    └── [sub-feature-2]/
```

### 2. ネストした機能の扱い

機能がネストしている場合（例: 何切る問題 → コメント → 返信）、各階層にCLAUDE.mdを配置します。

**例: 何切る問題の場合**

ドキュメント構造：

```
docs/features/what-to-discard-problems/
├── CLAUDE.md                        # 問題機能全体のドキュメント
├── comments/
│   └── CLAUDE.md                    # コメント機能のドキュメント
├── votes/
│   └── CLAUDE.md                    # 投票機能のドキュメント
└── likes/
    └── CLAUDE.md                    # いいね機能のドキュメント
```

コードベース構造：

```
src/app/what-to-discard-problems/
├── page.tsx                         # 問題一覧ページ
├── components/                      # 問題機能のコンポーネント
│   ├── forms/
│   ├── comments/
│   ├── votes/
│   └── likes/
├── context-providers/               # 機能固有のコンテキスト
├── schema/                          # バリデーションスキーマ
├── comments/
├── votes/
└── likes/
```

### 3. メインドキュメントからのリンク

親機能のCLAUDE.mdには、子機能へのリンクを含めます。

```markdown
## 関連ドキュメント

各機能の詳細実装ガイド：

- **[投票機能](votes/CLAUDE.md)** - 投票・投票結果表示・ビジュアルエフェクト
- **[コメント機能](comments/CLAUDE.md)** - コメント投稿・返信・削除
- **[いいね機能](likes/CLAUDE.md)** - いいね追加・削除・カウント表示
```

## ドキュメントの標準構成

各CLAUDE.mdは以下のセクションで構成します。

### 必須セクション

#### 1. 機能概要

```markdown
# [機能名] (English Name)

## 機能概要

[機能の説明を1-3文で簡潔に記述]
```

#### 2. ディレクトリ構造

```markdown
## ディレクトリ構造

### ドキュメント

\`\`\`
docs/features/[feature-name]/
├── CLAUDE.md
├── [sub-feature-1]/
│ └── CLAUDE.md
└── [sub-feature-2]/
└── CLAUDE.md
\`\`\`

### コードベース

\`\`\`
src/app/[feature-name]/
├── page.tsx
├── components/
├── context-providers/
├── schema/
└── [sub-feature]/
\`\`\`
```

#### 3. 主要コンポーネント

```markdown
## 主要コンポーネント

### ComponentName

- **役割**: [コンポーネントの役割]
- **Props**:
  - `prop1`: 説明
  - `prop2`: 説明

#### 機能詳細

1. **機能1**
   - 詳細説明

2. **機能2**
   - 詳細説明
```

#### 4. API連携

```markdown
## API連携

### [機能名]関連エンドポイント

- `GET /path` - 説明
  - Response: `{ ... }`

- `POST /path` - 説明
  - Body: `{ ... }`
  - Response: `{ ... }`
```

#### 5. 状態管理

```markdown
## 状態管理

### ローカル状態

\`\`\`typescript
const [state1, setState1] = useState(initialValue);
\`\`\`

### グローバル状態（Context名）

\`\`\`typescript
const { value } = useContext(SomeContext);
\`\`\`
```

#### 6. 処理フロー

```markdown
## [機能名]フロー

### ケース1

\`\`\`

1. アクション
   ↓
2. 処理
   ↓
3. 結果
   \`\`\`
```

#### 7. 開発時の注意点

```markdown
## 開発時の注意点

### 認証

- 認証に関する注意点

### パフォーマンス

- パフォーマンスに関する注意点

### その他

- その他の重要な注意点
```

### オプションセクション

#### UIスタイル

```markdown
## UIスタイル

### [スタイル名]

\`\`\`typescript
<Component ... />
\`\`\`
```

#### エラーハンドリング

```markdown
## エラーハンドリング

### [エラーケース]

\`\`\`typescript
try {
// 処理
} catch (error) {
// エラーハンドリング
}
\`\`\`
```

#### バリデーション

```markdown
## バリデーション

### Zodスキーマ

\`\`\`typescript
schemas.example = { ... }
\`\`\`
```

#### 関連ドキュメント

```markdown
## 関連ドキュメント

各機能の詳細実装ガイド：

- **[機能1](path/CLAUDE.md)** - 説明
- **[機能2](path/CLAUDE.md)** - 説明
```

## ドキュメント作成のベストプラクティス

### 1. 具体的なコード例を含める

理論だけでなく、実際のコード例を豊富に含めます。

```markdown
❌ 悪い例:
状態を管理します。

✅ 良い例:
\`\`\`typescript
const [isLiked, setIsLiked] = useState(Boolean(problem.is_liked_by_me));
const [likesCount, setLikesCount] = useState(problem.likes_count);
\`\`\`
```

### 2. フロー図を活用する

処理の流れはテキストベースのフロー図で表現します。

```markdown
\`\`\`

1. ユーザーアクション
   ↓
2. API呼び出し
   ↓
3. 状態更新
   ↓
4. UI反映
   \`\`\`
```

### 3. ファイルパスを明記する

関連ファイルへの参照は必ずパスを含めます。

```markdown
### 共有コンポーネント

- `@/src/components/LikeButton.tsx` - いいねボタンUI
- `@/src/components/Modals/NotLoggedInModal.tsx` - 未ログインモーダル
```

### 4. 注意点は具体的に書く

抽象的な注意点ではなく、実装時に役立つ具体的な情報を記載します。

```markdown
❌ 悪い例:

- エラーハンドリングを適切に行う

✅ 良い例:

- API失敗時も楽観的更新により状態が変更される
- エラー時は状態をロールバックする実装も検討可能
- 現状はエラートーストで通知のみ
```

### 5. 型情報を含める

TypeScriptの型情報を積極的に記載します。

```markdown
- **Props**:
  - `problem`: WhatToDiscardProblem型
  - `setProblems`: (problems: WhatToDiscardProblem[]) => void
```

## ドキュメント作成のワークフロー

### Step 1: 機能を分析する

1. 機能の責務を明確にする
2. サブ機能があるか確認する
3. 関連コンポーネントをリストアップする

### Step 2: ディレクトリ構造を決定する

1. `docs/features/` 配下にメイン機能のディレクトリを作成
2. サブ機能がある場合、ネストした構造を作る
3. 各階層にCLAUDE.mdを配置する計画を立てる

例：

```bash
mkdir -p docs/features/[feature-name]/{[sub-feature-1],[sub-feature-2]}
touch docs/features/[feature-name]/CLAUDE.md
touch docs/features/[feature-name]/[sub-feature-1]/CLAUDE.md
```

### Step 3: ドキュメントを作成する

1. テンプレートに従ってセクションを埋める
2. コード例を実際のコードから引用する
3. フロー図で処理を視覚化する
4. 注意点を開発者目線で記載する

### Step 4: リンクを設定する

1. 親機能のCLAUDE.mdに子機能へのリンクを追加
2. トップレベル（`frontend/CLAUDE.md`）の機能一覧を更新

### Step 5: レビューする

1. 新規開発者が理解できる内容か確認
2. コード例が最新か確認
3. リンク切れがないか確認

## 既存ドキュメントの例

### トップレベル（frontend/CLAUDE.md）

```markdown
## 機能別ドキュメント

各機能の詳細な実装ガイドは `docs/features/` ディレクトリに集約されています：

- **[何切る問題](docs/features/what-to-discard-problems/CLAUDE.md)** - 問題作成・投票・コメント・いいね機能
  - [投票機能](docs/features/what-to-discard-problems/votes/CLAUDE.md)
  - [コメント機能](docs/features/what-to-discard-problems/comments/CLAUDE.md)
  - [いいね機能](docs/features/what-to-discard-problems/likes/CLAUDE.md)
- **[認証](docs/features/auth/CLAUDE.md)** - メールトークン認証・Google OAuth・LINE認証

### ドキュメント作成ガイド

新しい機能のドキュメントを作成する際は、**[ドキュメント作成ガイド](docs/DOCUMENTATION_GUIDE.md)** を参照してください。
```

### メイン機能（docs/features/what-to-discard-problems/CLAUDE.md）

```markdown
## ディレクトリ構造

### コードベース

\`\`\`
src/app/what-to-discard-problems/
├── page.tsx
├── components/
│ ├── forms/ # 問題作成・編集フォーム
│ ├── comments/ # コメント機能
│ ├── votes/ # 投票機能
│ └── likes/ # いいね機能
├── context-providers/
└── schema/
\`\`\`

### ドキュメント

\`\`\`
docs/features/what-to-discard-problems/
├── CLAUDE.md # このファイル
├── comments/CLAUDE.md # コメント機能の詳細ドキュメント
├── votes/CLAUDE.md # 投票機能の詳細ドキュメント
└── likes/CLAUDE.md # いいね機能の詳細ドキュメント
\`\`\`

## 関連ドキュメント

各機能の詳細実装ガイド：

- **[投票機能](votes/CLAUDE.md)** - 投票・投票結果表示・ビジュアルエフェクト
- **[コメント機能](comments/CLAUDE.md)** - コメント投稿・返信・削除
- **[いいね機能](likes/CLAUDE.md)** - いいね追加・削除・カウント表示
```

### サブ機能（docs/features/what-to-discard-problems/comments/CLAUDE.md）

```markdown
# コメント機能 (Comments)

## 機能概要

何切る問題に対してコメントを投稿・返信・削除できる機能です。

## コンポーネント構造

\`\`\`
components/comments/
├── CommentsModal.tsx
├── CommentForm.tsx
├── ParentCommentCard.tsx
└── ChildCommentCard.tsx
\`\`\`
```

## チェックリスト

新しいドキュメントを作成する際は、以下を確認してください。

- [ ] ドキュメントを `docs/features/[feature-name]/` 配下に配置している
- [ ] 機能概要が明確に記載されている
- [ ] ディレクトリ構造が図示されている（コードベース `src/app/` とドキュメント `docs/features/` を分けて記載）
- [ ] 主要コンポーネントの役割とPropsが記載されている
- [ ] API連携の詳細（エンドポイント、リクエスト/レスポンス）が記載されている
- [ ] 状態管理の詳細（ローカル/グローバル）が記載されている
- [ ] 処理フローが視覚化されている
- [ ] 開発時の注意点が具体的に記載されている
- [ ] 実際のコード例が含まれている
- [ ] 親機能のCLAUDE.mdに子機能へのリンクが追加されている
- [ ] トップレベル（`frontend/CLAUDE.md`）の機能一覧が更新されている

## まとめ

このガイドに従うことで、以下を実現できます。

1. **一貫性**: すべてのドキュメントが同じ構造を持つ
2. **発見性**: 機能ベースの階層構造で目的のドキュメントを見つけやすい
3. **保守性**: 機能追加・変更時にドキュメントを更新しやすい
4. **開発効率**: 新規開発者が迅速に機能を理解できる

ドキュメントは**コードと同じくらい重要**です。機能を実装したら、必ずドキュメントも作成・更新しましょう。
