# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Users::FollowStats", type: :request do
  describe "GET /users/:user_id/follow_stats" do
    subject { get user_follow_stats_url(user_id: user_id) }

    context "ユーザーが存在する場合" do
      let(:user) { create(:user) }
      let(:user_id) { user.id }

      it "フォロー統計を返すこと" do
        subject
        expect(response).to have_http_status(:ok)
        assert_schema_conform(200)

        json = response.parsed_body
        expect(json["following_count"]).to eq(0)
        expect(json["followers_count"]).to eq(0)
      end

      context "フォロー・フォロワーがいる場合" do
        let(:other_users) { create_list(:user, 3) }

        before do
          other_users[0..1].each { |other| user.follow(other) }
          other_users[2].follow(user)
        end

        it "正しいカウントを返すこと" do
          subject
          expect(response).to have_http_status(:ok)
          assert_schema_conform(200)

          json = response.parsed_body
          expect(json["following_count"]).to eq(2)
          expect(json["followers_count"]).to eq(1)
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
