# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Users", type: :request do
  include LoginHelper

  describe "GET /users/:id" do
    subject { get user_url(id: user.id), headers: }

    let(:user) { create(:user) }
    let(:headers) { {} }

    context "ユーザーが存在する場合" do
      it "ユーザー情報を返すこと" do
        subject
        expect(response).to have_http_status(:ok)
        assert_schema_conform(200)

        json = response.parsed_body
        expect(json["id"]).to eq(user.id)
        expect(json["name"]).to eq(user.name)
        expect(json["is_followed_by_me"]).to be false
      end
    end

    context "ログインしている場合" do
      let(:current_user) { create(:user) }
      let(:access_token) { get_access_token(current_user) }
      let(:headers) { { "Authorization" => "Bearer #{access_token}" } }

      context "フォローしていない場合" do
        it "is_followed_by_meがfalseになること" do
          subject
          json = response.parsed_body
          expect(json["is_followed_by_me"]).to be false

          assert_schema_conform(200)
        end
      end

      context "フォローしている場合" do
        before { current_user.follow(user) }

        it "is_followed_by_meがtrueになること" do
          subject
          json = response.parsed_body
          expect(json["is_followed_by_me"]).to be true

          assert_schema_conform(200)
        end
      end
    end

    context "ユーザーが存在しない場合" do
      subject { get user_url(id: 0), headers: }

      it "404を返すこと" do
        subject
        expect(response).to have_http_status(:not_found)
        assert_schema_conform(404)
      end
    end
  end
end
