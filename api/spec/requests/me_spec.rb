# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Me", type: :request do
  include LoginHelper

  describe "GET /me" do
    subject { get me_url, headers: { "Authorization" => "Bearer #{access_token}" } }

    context "ログインしていない場合" do
      let(:access_token) { "invalid_token" }

      it "401を返すこと" do
        subject
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "ログインしている場合" do
      let(:current_user) { create(:user) }
      let(:access_token) { get_access_token(current_user) }

      it "ユーザー情報を返すこと" do
        subject
        expect(response).to have_http_status(:ok)

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

    let(:params) { { name: "新しい名前", profile_text: "新しいプロフィール" } }

    context "ログインしていない場合" do
      let(:access_token) { "invalid_token" }

      it "401を返すこと" do
        subject
        expect(response).to have_http_status(:unauthorized)

        assert_schema_conform(401)
      end
    end

    context "ログインしている場合" do
      let(:current_user) { create(:user) }
      let(:access_token) { get_access_token(current_user) }

      context "有効なパラメータの場合" do
        it "ユーザー情報を更新して返すこと" do
          subject
          expect(response).to have_http_status(:ok)

          json = JSON.parse(response.body)
          expect(json["name"]).to eq("新しい名前")
          expect(json["profile_text"]).to eq("新しいプロフィール")

          assert_schema_conform(200)
        end
      end

      context "無効なパラメータの場合" do
        let(:params) { { name: "" } }

        it "422を返すこと" do
          subject
          expect(response).to have_http_status(:unprocessable_entity)

          json = JSON.parse(response.body)
          expect(json["errors"]).to be_present

          assert_schema_conform(422)
        end
      end
    end
  end
end
