# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Auth::Google::Callbacks", type: :request do
  describe "POST /auth/google/callback" do
    subject { post auth_google_callback_url, params: { code: }, headers: { "Content-Type" => "application/json" }, as: :json }

    let(:code) { "valid_authorization_code" }

    let(:google_client_id) { "test_client_id" }
    let(:google_client_secret) { "test_client_secret" }
    let(:google_redirect_uri) { "http://localhost:3000/auth/google/callback" }

    before do
      ENV["GOOGLE_CLIENT_ID"] = google_client_id
      ENV["GOOGLE_CLIENT_SECRET"] = google_client_secret
      ENV["GOOGLE_REDIRECT_URI"] = google_redirect_uri
    end

    after do
      ENV.delete("GOOGLE_CLIENT_ID")
      ENV.delete("GOOGLE_CLIENT_SECRET")
      ENV.delete("GOOGLE_REDIRECT_URI")
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
        expect(json_response["errors"]).to include("認証コードがありません")
      end
    end

    context "認証コードが空文字の場合" do
      let(:code) { "" }

      it "400を返すこと" do
        subject
        expect(response).to have_http_status(:bad_request)
        assert_schema_conform(400)
      end
    end

    context "トークン交換に失敗した場合" do
      before do
        token_response = double(code: "400", body: '{"error": "invalid_grant"}')
        allow_any_instance_of(Net::HTTP).to receive(:request).and_return(token_response)
      end

      it "422を返すこと" do
        subject
        expect(response).to have_http_status(:unprocessable_entity)
        assert_schema_conform(422)
      end

      it "エラーメッセージを返すこと" do
        subject
        json_response = JSON.parse(response.body)
        expect(json_response["errors"]).to include("Failed to exchange code for token")
      end
    end

    context "ユーザー情報の取得に失敗した場合" do
      before do
        token_response = double(
          code: "200",
          body: '{"access_token": "test_access_token", "id_token": "test_id_token"}'
        )
        user_info_response = double(code: "400", body: '{"error": "invalid_token"}')

        allow_any_instance_of(Net::HTTP).to receive(:request)
          .with(instance_of(Net::HTTP::Post)).and_return(token_response)
        allow_any_instance_of(Net::HTTP).to receive(:request)
          .with(instance_of(Net::HTTP::Get)).and_return(user_info_response)
      end

      it "422を返すこと" do
        subject
        expect(response).to have_http_status(:unprocessable_entity)
        assert_schema_conform(422)
      end

      it "エラーメッセージを返すこと" do
        subject
        json_response = JSON.parse(response.body)
        expect(json_response["errors"]).to include("Failed to fetch user info")
      end
    end

    context "認証が成功した場合" do
      let(:email) { "test@example.com" }

      before do
        token_response = double(
          code: "200",
          body: '{"access_token": "test_access_token", "id_token": "test_id_token"}'
        )
        user_info_response = double(
          code: "200",
          body: { email: email }.to_json
        )

        allow_any_instance_of(Net::HTTP).to receive(:request)
          .with(instance_of(Net::HTTP::Post)).and_return(token_response)
        allow_any_instance_of(Net::HTTP).to receive(:request)
          .with(instance_of(Net::HTTP::Get)).and_return(user_info_response)
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
