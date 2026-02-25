# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Users::Followers", type: :request do
  describe "GET /users/:user_id/followers" do
    subject { get user_followers_url(user_id: user_id) }

    context "ユーザーが存在する場合" do
      let(:user) { create(:user) }
      let(:user_id) { user.id }

      context "フォロワーがいない場合" do
        it "空の配列を返すこと" do
          subject
          expect(response).to have_http_status(:ok)
          assert_schema_conform(200)

          json = response.parsed_body
          expect(json["users"]).to eq([])
        end
      end

      context "フォロワーがいる場合" do
        let(:followers) { create_list(:user, 2) }

        before do
          followers.each { |follower| follower.follow(user) }
        end

        it "フォロワー一覧を返すこと" do
          subject
          expect(response).to have_http_status(:ok)
          assert_schema_conform(200)

          json = response.parsed_body
          expect(json["users"].length).to eq(2)
          expect(json["users"].map { |u| u["id"] }).to match_array(followers.map(&:id))
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
