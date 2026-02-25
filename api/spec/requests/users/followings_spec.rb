# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Users::Followings", type: :request do
  describe "GET /users/:user_id/followings" do
    subject { get user_followings_url(user_id: user_id) }

    context "ユーザーが存在する場合" do
      let(:user) { create(:user) }
      let(:user_id) { user.id }

      context "フォロー中のユーザーがいない場合" do
        it "空の配列を返すこと" do
          subject
          expect(response).to have_http_status(:ok)
          assert_schema_conform(200)

          json = response.parsed_body
          expect(json["users"]).to eq([])
        end
      end

      context "フォロー中のユーザーがいる場合" do
        let(:followings) { create_list(:user, 2) }

        before do
          followings.each { |following| user.follow(following) }
        end

        it "フォロー中ユーザー一覧を返すこと" do
          subject
          expect(response).to have_http_status(:ok)
          assert_schema_conform(200)

          json = response.parsed_body
          expect(json["users"].length).to eq(2)
          expect(json["users"].map { |u| u["id"] }).to match_array(followings.map(&:id))
        end

        it "ユーザー情報を含むこと" do
          subject
          json = response.parsed_body
          user_json = json["users"].first

          expect(user_json).to have_key("id")
          expect(user_json).to have_key("name")
          expect(user_json).to have_key("avatar_url")
          expect(user_json).to have_key("profile_text")
        end
      end
    end

    context "ユーザーが存在しない場合" do
      let(:user_id) { 0 }

      it "404を返すこと" do
        subject
        expect(response).to have_http_status(:not_found)
        assert_schema_conform(404)
      end
    end
  end
end
