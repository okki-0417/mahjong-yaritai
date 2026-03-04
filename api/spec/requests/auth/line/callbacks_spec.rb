# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Auth::Line::Callbacks", type: :request do
  describe "POST /auth/line/callback" do
    subject { post auth_line_callback_url, params: { code:, state:, line_login_id: }, headers: { "Content-Type" => "application/json" }, as: :json }

    let(:line_login) { create(:line_login) }
    let(:code) { "valid_authorization_code" }
    let(:state) { line_login.state }
    let(:line_login_id) { EncryptionService.encrypt(line_login.id) }

    let(:line_channel_id) { "test_channel_id" }
    let(:line_channel_secret) { "test_channel_secret" }
    let(:line_redirect_uri) { "http://localhost:3000/auth/line/callback" }

    before do
      ENV["LINE_CHANNEL_ID"] = line_channel_id
      ENV["LINE_CHANNEL_SECRET"] = line_channel_secret
      ENV["LINE_REDIRECT_URI"] = line_redirect_uri
    end

    after do
      ENV.delete("LINE_CHANNEL_ID")
      ENV.delete("LINE_CHANNEL_SECRET")
      ENV.delete("LINE_REDIRECT_URI")
    end

    context "stateパラメータが無効な場合" do
      let(:state) { "invalid_state" }

      it "400を返すこと" do
        subject
        expect(response).to have_http_status(:bad_request)
      end

      it "エラーメッセージを返すこと" do
        subject
        json_response = JSON.parse(response.body)
        expect(json_response["errors"]).to include("パラメーターが不正です")
      end
    end

    context "line_login_idが無効な場合" do
      let(:line_login_id) { "invalid_encrypted_id" }

      it "400を返すこと" do
        subject
        expect(response).to have_http_status(:bad_request)
      end

      it "エラーメッセージを返すこと" do
        subject
        json_response = JSON.parse(response.body)
        expect(json_response["errors"]).to include("パラメーターが不正です")
      end
    end

    context "line_login_idがない場合" do
      let(:line_login_id) { nil }

      it "400を返すこと" do
        subject
        expect(response).to have_http_status(:bad_request)
      end
    end

    context "認証コードがない場合" do
      let(:code) { nil }

      it "400を返すこと" do
        subject
        expect(response).to have_http_status(:bad_request)
      end

      it "エラーメッセージを返すこと" do
        subject
        json_response = JSON.parse(response.body)
        expect(json_response["errors"]).to include("Authorization code が存在しません")
      end
    end

    context "トークン交換に失敗した場合" do
      before do
        allow_any_instance_of(Auth::Line::CallbacksController).to receive(:exchange_code_for_token).and_return(
          { error: "Invalid authorization code" }
        )
      end

      it "422を返すこと" do
        subject
        expect(response).to have_http_status(:unprocessable_entity)
        assert_schema_conform(422)
      end

      it "エラーメッセージを返すこと" do
        subject
        json_response = JSON.parse(response.body)
        expect(json_response["errors"]).to include("Invalid authorization code")
      end
    end

    context "IDトークンの検証に失敗した場合" do
      before do
        allow_any_instance_of(Auth::Line::CallbacksController).to receive(:exchange_code_for_token).and_return(
          { access_token: "test_access_token", id_token: "test_id_token", refresh_token: "test_refresh_token" }
        )
        allow_any_instance_of(Auth::Line::CallbacksController).to receive(:verify_id_token).and_return(
          { error: "IDトークンの検証に失敗しました" }
        )
      end

      it "422を返すこと" do
        subject
        expect(response).to have_http_status(:unprocessable_entity)
        assert_schema_conform(422)
      end

      it "エラーメッセージを返すこと" do
        subject
        json_response = JSON.parse(response.body)
        expect(json_response["errors"]).to include("IDトークンの検証に失敗しました")
      end
    end

    context "認証が成功した場合" do
      let(:email) { "test@example.com" }

      before do
        allow_any_instance_of(Auth::Line::CallbacksController).to receive(:exchange_code_for_token).and_return(
          { access_token: "test_access_token", id_token: "test_id_token", refresh_token: "test_refresh_token" }
        )
        allow_any_instance_of(Auth::Line::CallbacksController).to receive(:verify_id_token).and_return(
          { email: email }
        )
      end

      context "既存ユーザーの場合" do
        let!(:existing_user) { create(:user, email: email) }

        it "201を返すこと" do
          subject
          expect(response).to have_http_status(:created)
          assert_schema_conform(201)
        end

        it "access_tokenとrefresh_tokenを返すこと" do
          subject
          json_response = JSON.parse(response.body)
          expect(json_response).to have_key("access_token")
          expect(json_response).to have_key("refresh_token")
        end

        it "ユーザー名を返すこと" do
          subject
          json_response = JSON.parse(response.body)
          expect(json_response["user_name"]).to eq(existing_user.name)
        end
      end

      context "新規ユーザーの場合" do
        let(:email) { "newuser@example.com" }

        it "201を返すこと" do
          subject
          expect(response).to have_http_status(:created)
          assert_schema_conform(201)
        end

        it "AuthRequestを作成すること" do
          expect { subject }.to change(AuthRequest, :count).by(1)
        end

        it "暗号化されたメールアドレスを返すこと" do
          subject
          json_response = JSON.parse(response.body)
          expect(json_response).to have_key("encrypted_email")
        end

        it "access_tokenがnullであること" do
          subject
          json_response = JSON.parse(response.body)
          expect(json_response["access_token"]).to be_nil
        end
      end

      context "AuthRequestの保存に失敗した場合" do
        let(:email) { "newuser@example.com" }

        before do
          allow_any_instance_of(AuthRequest).to receive(:save).and_return(false)
          allow_any_instance_of(AuthRequest).to receive_message_chain(:errors, :full_messages)
            .and_return([ "Email is invalid" ])
        end

        it "422を返すこと" do
          subject
          expect(response).to have_http_status(:unprocessable_entity)
          assert_schema_conform(422)
        end

        it "エラーメッセージを返すこと" do
          subject
          json_response = JSON.parse(response.body)
          expect(json_response["errors"]).to include("Email is invalid")
        end
      end
    end
  end
end
