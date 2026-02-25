# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

「麻雀ヤリタイ」の Rails 7.2.1 API専用アプリケーションです。ユーザーが麻雀の手牌を分析し、どの牌を切るべきかを投票する「何切る問題」に特化したプラットフォームです。

### コアアーキテクチャ

- **フレームワーク**: Rails 7.2.1 (API専用モード)
- **データベース**: PostgreSQL
- **認証**: JWT認証（パスワードレス、メールトークン）
- **バックグラウンドジョブ**: Sidekiq (Redis使用)
- **ファイルストレージ**: ActiveStorage (開発:ローカル、本番:S3)
- **API**: REST エンドポイント
- **APIドキュメント**: OpenAPI 3.0 (`docs/openapi.yaml`)
- **スキーマ検証**: Committee
- **レスポンス生成**: json.jbuilder

### 認証アーキテクチャ

```
ブラウザ <--cookie--> Next.js (BFF) <--JWT--> Rails API
```

- **API側**: ステートレスなJWT認証。セッションやCookieは使用しない
- **BFF側**: Next.jsがJWTを管理し、ブラウザとはCookieでやり取り
- **トークン**: access_token（短期）+ refresh_token（長期）

> **注意**:
> - `ActiveModel::Serializer` と `GraphQL` は非推奨。今後削除予定
> - `Redis`（セッション管理用）も将来的に削除予定。Sidekiq用のみ残る可能性あり

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
- **redis**: Sidekiqジョブキュー用

## APIドキュメントとスキーマ検証

### OpenAPI + Committee

APIスキーマは `docs/openapi.yaml` で管理し、Committee gemでリクエスト/レスポンスを検証します。

```yaml
# docs/openapi.yaml の例
paths:
  /me:
    get:
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '401':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Errors'
    patch:
      requestBody:
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                name:
                  type: string
                avatar:
                  type: string
                  format: binary
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
```

### Committee設定

```ruby
# spec/rails_helper.rb
RSpec.configure do |config|
  include Committee::Rails::Test::Methods
  config.add_setting :committee_options
  config.committee_options = { schema_path: Rails.root.join('docs/openapi.yaml').to_s }
end
```

## レスポンス生成

### json.jbuilder パターン

レスポンスは `app/views/` 配下の `.json.jbuilder` ファイルで生成します。

```ruby
# app/views/me/show.json.jbuilder
json.id @current_user.id
json.name @current_user.name
json.email @current_user.email
json.avatar_url @current_user.avatar_url
json.profile_text @current_user.profile_text
```

```ruby
# app/views/users/_user.json.jbuilder
json.extract! user, :id, :name, :profile_text
json.avatar_url user.avatar_url
```

```ruby
# コレクションのレンダリング
json.users do
  json.array! @users, partial: 'users/user', as: :user
end
```

### コントローラーでの使用

```ruby
class MeController < ApplicationController
  def show
    # 自動的に app/views/me/show.json.jbuilder が使用される
  end

  def update
    if @current_user.update(user_params)
      render :show  # show.json.jbuilder を再利用
    else
      render json: { errors: @current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end
end
```

## テストパターン

### RSpec + Committee

```ruby
require "rails_helper"

RSpec.describe "Me", type: :request do
  include LoginHelper

  describe "GET /me" do
    subject { get me_url, headers: { "Authorization" => "Bearer #{access_token}" } }

    context "ログインしている場合" do
      let(:current_user) { create(:user) }
      let(:access_token) { get_access_token(current_user) }

      it "ユーザー情報を返すこと" do
        subject
        expect(response).to have_http_status(:ok)

        # OpenAPIスキーマに対して検証
        assert_schema_conform(200)
      end
    end
  end

  describe "PATCH /me" do
    subject do
      patch me_url,
        params:,
        headers: { "Authorization" => "Bearer #{access_token}", "Content-Type" => "multipart/form-data" }
    end

    let(:params) { { name: "新しい名前" } }
    let(:current_user) { create(:user) }
    let(:access_token) { get_access_token(current_user) }

    it "ユーザー情報を更新すること" do
      subject
      expect(response).to have_http_status(:ok)
      assert_schema_conform(200)
    end
  end
end
```

### assert_schema_conform

`assert_schema_conform(status_code)` は Committee が提供するメソッドで、レスポンスが `docs/openapi.yaml` のスキーマに準拠しているか検証します。

## 主要な設定パターン

### 環境別設定
- **開発**: `:local` ストレージ、`:sidekiq` ジョブ、letter_opener_web でメール確認
- **本番**: `:amazon` ストレージ (S3)、SMTP メール、カスタムロギング
- **テスト**: `:test` ストレージ、`:test` ジョブアダプター

### 認証フロー
1. POST `/auth/request` でメール送信 → 6桁トークン送信
2. POST `/auth/verify` でトークン検証 → access_token + refresh_token 発行
3. Authorization ヘッダーで `Bearer {access_token}` を送信
4. access_token 期限切れ時は POST `/auth/refresh` で refresh_token を使って再発行

### コントローラーでの認証パターン

ApplicationController に定義された認証メソッドを使い分けます。
コントローラーやビューからは常に `current_user` メソッドを使用します。

#### 1. 必須認証（`authorize_request`）

ログイン必須のエンドポイント。認証失敗時は 401 を返します。

```ruby
class MeController < ApplicationController
  before_action :authorize_request

  def show
    render json: current_user  # メソッドを使用
  end
end
```

#### 2. オプショナル認証

ゲストでもアクセス可能だが、ログイン時はユーザー情報を使いたい場合。
`before_action` は不要で、`current_user` を直接呼び出します（未ログインなら `nil`）。

```ruby
class WhatToDiscardProblemsController < ApplicationController
  def index
    @problems = WhatToDiscardProblem.all
  end
end

# app/views/what_to_discard_problems/index.json.jbuilder
json.problems @problems do |problem|
  json.is_liked_by_me current_user ? problem.liked_by?(current_user) : false
end
```

`current_user` は遅延評価でJWTをデコードし、結果をキャッシュします（`defined?` で再実行を防止）。

## API 構造

### 名前空間付きコントローラー
- `Auth::` - 認証エンドポイント
- `Me` - ユーザー固有アクション（プロフィール）
- `Users::` - ユーザー関連（フォロー等）

### 主要エンドポイント
- `GET /me` - 現在のユーザー情報
- `PATCH /me` - プロフィール更新
- `POST /auth/request` - 認証リクエスト
- `POST /auth/verify` - トークン検証

## バックグラウンドジョブとメール

### Sidekiq 設定
- Redis をジョブキューに使用
- ワーカー用の独立 Docker コンテナ
- ActiveJob 経由でメール配信とファイル処理を実行

### メールシステム
- 開発: letter_opener_web (`/letter_opener`)
- 本番: Gmail 経由の SMTP
- 自動メール: 認証トークン

## ファイルストレージ

### ActiveStorage 設定
- 開発/テスト: ローカルディスクストレージ
- 本番: AWS S3（適切な環境変数設定）

## 環境変数

### 開発環境で必要
```
REDIS_HOST=redis
REDIS_PORT=6379
HOST_NAME=localhost:3001
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

- Render デプロイメント対応
- Sentry エラー監視統合
- カスタムヘルスチェックエンドポイント: `/` と `/up`

## データベーススキーマ要点

### 主要テーブル

#### 認証・ユーザー
- `users`: メールベース認証、20文字以内の名前、jti（JWT無効化用）
- `auth_requests`: 6桁トークン、15分有効期限
- `follows`: フォロー関係（follower_id, followee_id、ユニーク制約）

#### 何切る問題
- `tiles`: 34種類の麻雀牌（suit, ordinal_number_in_suit）
- `what_to_discard_problems`: 14牌（hand1-13, tsumo, dora）+ メタ情報
- `what_to_discard_problem_votes`: ユーザーの投票（ユニーク制約）

#### 麻雀戦績記録
- `mahjong_sessions`: セッション（開催）情報
- `mahjong_scoring_settings`: スコア計算設定
- `mahjong_participants`: セッション参加者（中間テーブル）
- `mahjong_games`: 半荘（ゲーム）
- `mahjong_results`: ゲーム結果

#### ソーシャル機能
- `comments`: ポリモーフィック、自己参照（返信）
- `likes`: ポリモーフィック、ユーザーごとにユニーク

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
```

## 開発フロー

### 新規エンドポイント追加時

1. **OpenAPIスキーマを定義** (`docs/openapi.yaml`)
   ```yaml
   paths:
     /new-endpoint:
       get:
         responses:
           '200':
             content:
               application/json:
                 schema:
                   $ref: '#/components/schemas/NewResource'
   ```

2. **ルーティングを追加** (`config/routes.rb`)

3. **コントローラーを実装**

4. **json.jbuilderでレスポンスを定義** (`app/views/`)

5. **RSpecテストを作成** (`spec/requests/`)
   - `assert_schema_conform` でスキーマ検証

6. **フロントエンドでAPIクライアント再生成**
   ```bash
   cd frontend && npm run gen:api
   ```
