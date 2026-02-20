# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Queries::Following", type: :request do
  include GraphqlHelper

  describe "following" do
    subject do
      execute_query(query, variables, context: { current_user: })
      JSON.parse(response.body, symbolize_names: true)
    end

    let(:current_user) { create(:user) }
    let(:variables) { {} }
    let(:query) do
      <<~GQL
        query {
          followings {
            edges {
              node {
                id
                name
                profileText
                avatarUrl
                isFollowing
                createdAt
              }
              cursor
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      GQL
    end

    context "ログインしていない場合" do
      let(:current_user) { nil }

      it "空のデータが返ること" do
        json = subject

        expect(json[:data][:followings][:edges]).to eq([])
      end
    end

    context "フォローしているユーザーがいない場合" do
      it "空のedgesを返すこと" do
        json = subject

        expect(json[:errors]).to be_nil
        expect(json[:data][:followings][:edges]).to eq([])
      end
    end

    context "フォローしているユーザーがいる場合" do
      let!(:followed_user1) { create(:user, name: "User 1") }
      let!(:followed_user2) { create(:user, name: "User 2") }
      let!(:other_user) { create(:user, name: "Other User") }

      before do
        create(:follow, follower: current_user, followee: followed_user1, created_at: 2.days.ago)
        create(:follow, follower: current_user, followee: followed_user2, created_at: 1.day.ago)
      end

      it "フォローした順序の降順で返すこと" do
        json = subject

        edges = json[:data][:followings][:edges]
        expect(edges.size).to eq(2)

        # 最新のフォローが最初に来る
        expect(edges[0][:node][:name]).to eq("User 2")
        expect(edges[1][:node][:name]).to eq("User 1")
      end
    end

    context "フォローしているユーザーがアバターを持っている場合" do
      let!(:followed_user) { create(:user) }

      before do
        followed_user.avatar.attach(
          io: File.open(Rails.root.join("spec/fixtures/images/test.png")),
          filename: "test.png",
          content_type: "image/png"
        )
        create(:follow, follower: current_user, followee: followed_user)
      end

      it "avatarUrlが返ること" do
        json = subject

        node = json[:data][:followings][:edges][0][:node]
        expect(node[:avatarUrl]).to be_present
      end
    end
  end
end
