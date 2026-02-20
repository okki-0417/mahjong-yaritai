# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

「麻雀ヤリタイ」の Rails 7.2.1 API専用アプリケーションです。ユーザーが麻雀の手牌を分析し、どの牌を切るべきかを投票する「何切る問題」に特化したプラットフォームです。

### コアアーキテクチャ

- **フレームワーク**: Rails 7.2.1 (API専用モード)
- **データベース**: PostgreSQL + Redis (セッション・バックグラウンドジョブ用)
- **認証**: カスタムメール認証システム（パスワードなし）
- **バックグラウンドジョブ**: Sidekiq (Redis使用)
- **ファイルストレージ**: ActiveStorage (開発:ローカル、本番:S3)
- **API**: REST エンドポイント + OpenAPI 3.0.1 ドキュメント + GraphQL
- **シリアライゼーション**: ActiveModel::Serializer

## 主要ドメインモデル

### 認証システム
- **AuthRequest**: メール認証トークン管理（6桁コード、15分有効）
- **User**: ユーザーモデル（アバター付き、メール認証のみ）
- パスワード認証なし - メールで送信される一時トークンを使用

### 麻雀ドメイン

#### 何切る問題
- **Tile**: 34種類の麻雀牌（萬子、筒子、索子、字牌）
- **WhatToDiscardProblem**: 13枚の手牌 + 1枚のツモ牌、ユーザーが何を切るか投票
- **WhatToDiscardProblem::Vote**: ユーザーの投票
- **Comments & Likes**: 問題に対するソーシャル機能

#### 麻雀戦績記録機能
- **MahjongSession**: 麻雀開催（セッション）
  - 複数のゲームをまとめる単位
  - 作成者（creator_user）、ゲーム代総額（total_game_fee）を持つ
  - スコア設定（MahjongScoringsSetting）を参照

- **MahjongScoringsSetting**: スコア計算設定
  - レート（rate）、チップ額（chip_amount）
  - ウマルール（uma_rule_label）、オカルール（oka_rule_label）

- **MahjongParticipant**: セッション参加者
  - セッションとユーザーの中間テーブル
  - セッションごとに4人の参加者を登録

- **MahjongGame**: 半荘（ゲーム）
  - セッション内の1回のゲーム
  - 複数の結果（MahjongResult）を持つ

- **MahjongResult**: ゲーム結果
  - 参加者ごとの得点（score）、計算後ポイント（result_point）、着順（ranking）
  - 1ゲームにつき4つの結果（4人分）

### 主要な関連
```ruby
# 何切る問題
User has_many :created_what_to_discard_problems
WhatToDiscardProblem belongs_to 14牌 (hand1_id..hand13_id, tsumo_id, dora_id)
WhatToDiscardProblem has_many :votes, :comments, :likes

# 麻雀戦績記録
User has_many :mahjong_sessions (as creator_user)
User has_many :mahjong_participants
MahjongSession belongs_to :creator_user (User)
MahjongSession belongs_to :mahjong_scoring_setting
MahjongSession has_many :mahjong_games
MahjongSession has_many :mahjong_participants
MahjongParticipant belongs_to :mahjong_session
MahjongParticipant belongs_to :user
MahjongParticipant has_many :mahjong_results
MahjongGame belongs_to :mahjong_session
MahjongGame has_many :mahjong_results
MahjongResult belongs_to :mahjong_participant
MahjongResult belongs_to :mahjong_game
```

## 開発環境

### Docker セットアップ
すべてのコマンドは Docker Compose を使用：
```bash
# サービス起動
docker compose up

# Rails コマンド実行
docker compose exec app bundle exec rails [コマンド]

# データベース操作
docker compose exec app bundle exec rails db:create db:migrate db:seed

# コンソール
docker compose exec app bundle exec rails console

# テスト
docker compose exec app bundle exec rspec
docker compose exec app bundle exec rspec spec/specific_file_spec.rb
```

### 主要サービス
- **app**: Rails アプリケーション (ポート 3001)
- **sidekiq**: バックグラウンドジョブワーカー
- **db**: PostgreSQL データベース
- **redis**: セッションストア・ジョブキュー

## テストとドキュメント

### RSpec + Rswag テスト
Rswag を使用して RSpec テストから OpenAPI (Swagger) ドキュメントを自動生成：

```bash
# 全テスト実行
docker compose exec app bundle exec rspec

# 特定テスト実行
docker compose exec app bundle exec rspec spec/requests/users_spec.rb

# RSpec テストから swagger.yml を自動生成
docker compose exec app bundle exec rails rswag:specs:swaggerize
```

### Rswag の特徴
- **テストとドキュメントの統合**: RSpec テストがそのまま API ドキュメントになる
- **自動生成**: `spec/requests/` のテストから `swagger/v1/swagger.yaml` を生成
- **リクエスト/レスポンスの検証**: テスト実行時に OpenAPI スキーマに対して自動検証
- **実例の記録**: テストで使用した実際のリクエスト/レスポンスをドキュメントに含める

### API ドキュメント
- Swagger UI: `/api-docs` で利用可能
- 生成元: `spec/requests/` の rswag スペック
- 出力先: `swagger/v1/swagger.yaml`
- OpenAPI 3.0.1 仕様準拠

## 主要な設定パターン

### 環境別設定
- **開発**: `:local` ストレージ、`:sidekiq` ジョブ、letter_opener_web でメール確認
- **本番**: `:amazon` ストレージ (S3)、SMTP メール、カスタムロギング
- **テスト**: `:test` ストレージ、`:test` ジョブアダプター

### カスタムミドルウェアとロギング
- `CustomLogger`: ヘルスチェックログと頻繁なセッションチェックをフィルター
- Redis による環境別セキュリティ設定でのセッション管理

### 認証フロー
1. POST `/auth/request` でメール送信 → 6桁トークン送信
2. POST `/auth/verification` でトークン検証 → ユーザーデータ返却 + セッション設定
3. Redis でセッション管理、1ヶ月後に期限切れ

## API 構造

### 名前空間付きコントローラー
- `Auth::` - 認証エンドポイント
- `Me::` - ユーザー固有アクション（プロフィール、退会）
- `WhatToDiscardProblems::` - ネストされたリソース（コメント、投票、いいね）

### 主要エンドポイント
- `GET /session` - 現在のユーザーセッション（フロントエンドから頻繁に呼び出し）
- `POST /what_to_discard_problems` - 新規問題作成
- `GET /what_to_discard_problems/:id/votes/result` - 投票結果取得
- `POST /me/withdrawal` - ユーザーアカウント削除（メール通知付き）

## バックグラウンドジョブとメール

### Sidekiq 設定
- Redis をジョブキューに使用
- ワーカー用の独立 Docker コンテナ
- ActiveJob 経由でメール配信とファイル処理を実行

### メールシステム
- 開発: letter_opener_web
- 本番: Gmail 経由の SMTP
- 自動メール: 認証トークン、退会確認

## ファイルストレージとアセット

### ActiveStorage 設定
- 開発/テスト: ローカルディスクストレージ
- 本番: AWS S3（適切な環境変数設定）
- シリアライザー経由でアバター URL 生成（エラーハンドリング付き）

## 特別なアーキテクチャメモ

### カーソルベースのページネーション
`Paginationable` concern でのカスタム実装、オフセットページネーションより高パフォーマンス

### カスタムバリデーター
- 麻雀手牌の並び順バリデーション（理牌バリデーション）
- 日本語ローカライズエラーメッセージ

### セッションセキュリティ
- 環境別の異なるセッション設定
- Redis ベースセッション（適切な Cookie 設定）
- CSRF 保護無効（API 専用）

## 環境変数

### 開発環境で必要
```
REDIS_HOST=redis
REDIS_PORT=6379
HOST_NAME=localhost:3001
USER_AGENT=your-health-check-agent
```

### 本番環境で必要
```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-northeast-1
AWS_S3_BUCKET=
FRONTEND_HOST=
MAIL_ADDRESS=
MAIL_PASSWORD=
```

## データベースコマンド

```bash
# 作成とセットアップ
docker compose exec app bundle exec rails db:create db:migrate

# 麻雀牌とテストデータのシード
docker compose exec app bundle exec rails db:seed

# データベースリセット
docker compose exec app bundle exec rails db:drop db:create db:migrate db:seed
```

## デプロイメント

- Kamal デプロイメント設定済み
- Render デプロイメント対応
- Sentry エラー監視統合
- カスタムヘルスチェックエンドポイント: `/` と `/up`

## Rswag テストパターン

### 基本構造
```ruby
RSpec.describe "リソース名", type: :request do
  path "/エンドポイント" do
    get("説明") do
      tags "タグ名"
      operationId "操作ID"
      produces "application/json"

      parameter name: :パラメータ名, in: :query, type: :string

      response(200, "成功") do
        schema type: :object, properties: { ... }
        run_test!
      end
    end
  end
end
```

### テストからSwagger生成
- テストファイル: `spec/requests/*_spec.rb`
- 生成コマンド: `docker compose exec app bundle exec rails rswag:specs:swaggerize`
- 出力: `swagger/v1/swagger.yaml`

## データベーススキーマ要点

### 主要テーブル

#### 認証・ユーザー
- `users`: メールベース認証、20文字以内の名前
- `auth_requests`: 6桁トークン、15分有効期限
- `follows`: フォロー関係（follower_id, followee_id、ユニーク制約）

#### 何切る問題
- `tiles`: 34種類の麻雀牌（suit, ordinal_number_in_suit）
- `what_to_discard_problems`: 14牌（hand1-13, tsumo, dora）+ メタ情報
- `what_to_discard_problem_votes`: ユーザーの投票（ユニーク制約）

#### 麻雀戦績記録
- `mahjong_sessions`: セッション（開催）情報
  - `creator_user_id`: 作成者のユーザーID
  - `total_game_fee`: ゲーム代総額
  - `mahjong_scoring_setting_id`: スコア設定ID
- `mahjong_scoring_settings`: スコア計算設定
  - `rate`: レート
  - `chip_amount`: チップ額
  - `uma_rule_label`: ウマルール（例: "10-30"）
  - `oka_rule_label`: オカルール（例: "25000点30000点返し"）
- `mahjong_participants`: セッション参加者（中間テーブル）
  - `mahjong_session_id`, `user_id`
- `mahjong_games`: 半荘（ゲーム）
  - `mahjong_session_id`: どのセッションのゲームか
- `mahjong_results`: ゲーム結果
  - `mahjong_participant_id`: 参加者
  - `mahjong_game_id`: ゲーム
  - `score`: 得点（例: 38000）
  - `result_point`: 計算後ポイント（例: +43）
  - `ranking`: 着順（1-4）

#### ソーシャル機能
- `comments`: ポリモーフィック、自己参照（返信）
- `likes`: ポリモーフィック、ユーザーごとにユニーク

### インデックスとカウンターキャッシュ
- ユニークインデックス: email, user_id + what_to_discard_problem_id, follower_id + followee_id
- カウンターキャッシュ: comments_count, likes_count, votes_count, replies_count

## Factory Bot パターン

### 基本的な使い方
```ruby
# 単一レコード作成
user = create(:user)

# 複数レコード作成
users = create_list(:user, 3)

# ビルド（DBに保存しない）
user = build(:user)

# 属性オーバーライド
user = create(:user, name: "カスタム名", email: "custom@example.com")
```

### Association の定義方法
```ruby
# spec/factories/users.rb
FactoryBot.define do
  factory :user do
    sequence(:name) { |n| "テストユーザー#{n}" }
    sequence(:email) { |n| "user#{SecureRandom.urlsafe_base64}@example.com" }
  end
end

# spec/factories/follows.rb
FactoryBot.define do
  factory :follow do
    association :follower, factory: :user
    association :followee, factory: :user
  end
end

# spec/factories/comments.rb
FactoryBot.define do
  factory :comment do
    association :user
    association :commentable, factory: :what_to_discard_problem
    parent_comment_id { nil }
    content { "test content" }
  end
end
```

### Sequence の使用
```ruby
# 連番生成
sequence(:name) { |n| "テストユーザー#{n}" }

# ランダム値生成
sequence(:email) { |n| "user#{SecureRandom.urlsafe_base64}@example.com" }

# 循環パターン
sequence(:suit) { |n| n % 3 }
sequence(:ordinal_number_in_suit) { |n| n % 9 + 1 }
```

### Trait パターン
```ruby
# 特定の状態を持つファクトリー
factory :what_to_discard_problem do
  # 通常の設定
  association :user

  trait :dev do
    # 開発用の固定ID
    dora_id { 1 }
    hand1_id { 1 }
  end
end

# 使用例
create(:what_to_discard_problem, :dev)
```

### 麻雀戦績記録機能のFactory使用例

#### 基本的なセッションの作成
```ruby
# スコア設定を作成
scoring_setting = create(:mahjong_scoring_setting,
  rate: 100,
  chip_amount: 0,
  uma_rule_label: "10-30",
  oka_rule_label: "25000点30000点返し"
)

# セッションを作成
session = create(:mahjong_session,
  total_game_fee: 4000,
  creator_user: create(:user),
  mahjong_scoring_setting: scoring_setting
)

# 参加者を作成（4人）
participants = create_list(:mahjong_participant, 4, mahjong_session: session)

# または特定のユーザーで参加者を作成
user1 = create(:user, name: "東家")
participant1 = create(:mahjong_participant, mahjong_session: session, user: user1)
```

#### ゲームと結果の作成
```ruby
# ゲームを作成
game = create(:mahjong_game, mahjong_session: session)

# 各参加者の結果を作成（4人分）
create(:mahjong_result,
  mahjong_participant: participants[0],
  mahjong_game: game,
  score: 38000,
  result_point: 43,
  ranking: 1
)

create(:mahjong_result,
  mahjong_participant: participants[1],
  mahjong_game: game,
  score: 32000,
  result_point: -25,
  ranking: 2
)

create(:mahjong_result,
  mahjong_participant: participants[2],
  mahjong_game: game,
  score: 28000,
  result_point: -10,
  ranking: 3
)

create(:mahjong_result,
  mahjong_participant: participants[3],
  mahjong_game: game,
  score: 22000,
  result_point: -8,
  ranking: 4
)
```

#### 完全なセッションを一度に作成
```ruby
# 4人のユーザー
players = create_list(:user, 4)

# スコア設定
scoring_setting = create(:mahjong_scoring_setting, rate: 100)

# セッション
session = create(:mahjong_session,
  creator_user: players[0],
  mahjong_scoring_setting: scoring_setting,
  total_game_fee: 4000
)

# 参加者
participants = players.map do |player|
  create(:mahjong_participant, mahjong_session: session, user: player)
end

# 3ゲーム作成
3.times do
  game = create(:mahjong_game, mahjong_session: session)

  # 各ゲームの結果（適当な得点で）
  participants.each_with_index do |participant, index|
    create(:mahjong_result,
      mahjong_participant: participant,
      mahjong_game: game,
      score: [38000, 32000, 28000, 22000][index],
      result_point: [43, -25, -10, -8][index],
      ranking: index + 1
    )
  end
end
```

## RSpec + Rswag テストパターン

### 基本構造
```ruby
require "swagger_helper"

RSpec.describe "リソース名", type: :request do
  path "/エンドポイント" do
    parameter name: :パラメータ名, in: :path, type: :string

    get("説明") do
      tags "タグ名"
      operationId "操作ID"
      produces "application/json"

      response(200, "成功") do
        # テストデータ作成
        let(:resource) { create(:resource) }

        # スキーマ定義
        schema type: :object,
          properties: { ... }

        run_test!
      end
    end
  end
end
```

### 認証が必要なエンドポイント
```ruby
response(200, "成功") do
  let(:current_user) { create(:user) }
  include_context "logged_in_rswag"

  # テストロジック
  run_test!
end

response(401, "unauthorized") do
  # current_userを設定しない
  run_test!
end
```

### リクエストボディのテスト
```ruby
post("作成") do
  parameter name: :request_params, in: :body, schema: {
    type: :object,
    required: %w[resource],
    properties: {
      resource: {
        type: :object,
        properties: {
          name: { type: :string }
        }
      }
    }
  }

  response(201, "created") do
    let(:request_params) do
      {
        resource: {
          name: "テスト"
        }
      }
    end

    run_test!
  end
end
```

### ファイルアップロードのテスト
```ruby
parameter name: :avatar, in: :formData, schema: {
  type: :object,
  properties: {
    avatar: { type: :string, format: :binary }
  }
}

response(200, "ok") do
  let(:avatar) {
    fixture_file_upload(
      File.join(Rails.root, "spec/fixtures/images/test.png")
    )
  }

  run_test!
end
```

### レスポンス例の記録
```ruby
response(200, "ok") do
  after do |example|
    example.metadata[:response][:content] = {
      "application/json" => {
        example: JSON.parse(response.body, symbolize_names: true)
      }
    }
  end

  run_test!
end
```

### よく使うマッチャー
```ruby
# Factory Bot
create(:model)          # DBに保存
build(:model)           # インスタンス作成のみ
create_list(:model, 3)  # 複数作成

# RSpec
expect(user).to be_valid
expect(user.errors).to be_present
expect(response).to have_http_status(:ok)
expect(json_response).to include(key: value)
```

## GraphQL開発パターン

### GraphQLミューテーションの実装

#### BaseMutation の特徴
- `GraphQL::Schema::RelayClassicMutation` を継承
- 自動的にInputオブジェクトが生成される
- argumentsは常に `input` パラメータにラップされる

#### ミューテーション実装パターン
```ruby
module Mutations
  class ExampleMutation < BaseMutation
    description "Example mutation description"

    # field定義を先に書く
    field :success, Boolean, null: false
    field :errors, [String], null: false
    field :result, Types::ExampleType, null: true

    # argument定義をfieldの後に書く
    argument :param1, String, required: true
    argument :param2, ID, required: false

    def resolve(param1:, param2: nil)
      # ビジネスロジック
      if success_condition
        { success: true, errors: [], result: result_object }
      else
        { success: false, errors: ["Error message"], result: nil }
      end
    rescue StandardError => e
      Rails.logger.error "Mutation error: #{e.message}"
      { success: false, errors: ["Unexpected error"], result: nil }
    end
  end
end
```

#### MutationType への追加
```ruby
module Types
  class MutationType < Types::BaseObject
    field :example_mutation, mutation: Mutations::ExampleMutation
  end
end
```

### GraphQL Context とセッション管理

#### セッション情報へのアクセス
```ruby
def resolve(...)
  current_user = context[:current_user]
  session = context[:session]

  # セッション更新
  context[:session][:key] = value
  context[:current_user] = updated_user
end
```

#### 認証チェックパターン
```ruby
def resolve(...)
  if context[:current_user].blank?
    return { success: false, errors: ["Authentication required"] }
  end

  # 認証済みユーザー向け処理
end
```

### GraphQLテストパターン

#### 基本的なテスト構造
```ruby
require "rails_helper"

RSpec.describe "GraphQL ExampleMutation", type: :request do
  describe "exampleMutation" do
    let(:mutation) do
      <<~GRAPHQL
        mutation ExampleMutation($input: ExampleMutationInput!) {
          exampleMutation(input: $input) {
            success
            errors
            result {
              id
              name
            }
          }
        }
      GRAPHQL
    end

    let(:variables) { { input: { param1: "value1" } } }

    it "succeeds with valid input" do
      post "/graphql", params: {
        query: mutation,
        variables: variables.to_json
      }

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      data = json["data"]["exampleMutation"]

      expect(data["success"]).to be true
      expect(data["errors"]).to be_empty
    end
  end
end
```

#### 認証が必要なテスト
```ruby
context "when authenticated" do
  let(:user) { create(:user) }

  before do
    allow_any_instance_of(GraphqlController).to receive(:current_user).and_return(user)
  end

  it "allows authenticated access" do
    post "/graphql", params: {
      query: mutation,
      variables: variables.to_json
    }

    # テストロジック
  end
end

context "when not authenticated" do
  before do
    allow_any_instance_of(GraphqlController).to receive(:current_user).and_return(nil)
  end

  it "rejects unauthenticated access" do
    # テストロジック
  end
end
```

#### パラメータの渡し方
```ruby
# 正しい - variables は JSON 文字列として渡す
post "/graphql", params: {
  query: mutation,
  variables: variables.to_json
}

# 間違い - ハッシュのまま渡すとエラー
post "/graphql", params: {
  query: mutation,
  variables: variables  # これはNG
}
```

#### よくあるテストパターン
```ruby
# データベース変更のテスト
expect {
  post "/graphql", params: { query: mutation, variables: variables.to_json }
}.to change(Model, :count).by(1)

# メール送信のテスト
expect {
  post "/graphql", params: { query: mutation, variables: variables.to_json }
}.to change(ActionMailer::Base.deliveries, :count).by(1)

# レスポンス内容のテスト
json = JSON.parse(response.body)
data = json["data"]["mutationName"]
expect(data["fieldName"]).to eq expected_value
```

### GraphQLスキーマの動作確認

#### Introspection クエリ
```bash
# 利用可能なミューテーション一覧を確認
curl -X POST http://localhost:3001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query IntrospectionQuery { __schema { mutationType { fields { name args { name type { name } } } } } }"}'
```

#### 直接ミューテーションテスト
```bash
# requestAuth のテスト
curl -X POST http://localhost:3001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { requestAuth(input: { email: \"test@example.com\" }) { success errors message } }"}'

# verifyAuth のテスト
curl -X POST http://localhost:3001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { verifyAuth(input: { email: \"test@example.com\", token: \"123456\" }) { success errors user { id name } } }"}'
```

### 開発時のよくあるハマりポイント

#### 1. RelayClassicMutation の Input オブジェクト
```ruby
# GraphQLクエリ側
mutation ExampleMutation($input: ExampleMutationInput!) {
  exampleMutation(input: $input) {
    # ...
  }
}

# フロントエンド側の変数
const variables = {
  input: {  // inputオブジェクトでラップが必要
    email: "test@example.com",
    token: "123456"
  }
}
```

#### 2. フィールドとアーギュメントの定義順序
```ruby
# 正しい順序
field :success, Boolean, null: false
field :errors, [String], null: false
argument :email, String, required: true

# 推奨しない（動くが読みにくい）
argument :email, String, required: true
field :success, Boolean, null: false
```

#### 3. エラーハンドリングの統一
```ruby
# 成功時
{ success: true, errors: [], result: object }

# バリデーションエラー
{ success: false, errors: model.errors.full_messages, result: nil }

# システムエラー
{ success: false, errors: ["System error occurred"], result: nil }
```

#### 4. null/not_null の適切な設定
```ruby
# エラー配列は空配列を返すので null: false
field :errors, [String], null: false

# 成功時のみデータがあるので null: true
field :user, Types::UserType, null: true

# 必ず値があるので null: false
field :success, Boolean, null: false
```

### デバッグのベストプラクティス

#### GraphQL エラーの調査
1. Rails ログでエラー詳細を確認
2. GraphQL Playground（開発時）で手動テスト
3. RSpec テストで期待値と実際の値を比較

#### 開発フロー
1. GraphQL ミューテーション実装
2. curl での動作確認
3. RSpec テストの作成・実行
4. フロントエンド GraphQL クエリ作成
5. Apollo Client での統合テスト

これらのパターンを参考に、効率的なGraphQL開発を進めることができます。