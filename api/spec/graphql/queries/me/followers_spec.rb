# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Queries::Followers", type: :request do
  include GraphqlHelper

  describe "followers" do
    subject do
      execute_query(query, variables, context: { current_user: })
      JSON.parse(response.body, symbolize_names: true)
    end

    let(:current_user) { create(:user) }
    let(:variables) { {} }
    let(:query) do
      <<~GQL
        query {
          followers {
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

        expect(json[:data][:followers][:edges]).to eq([])
      end
    end

    context "フォロワーがいない場合" do
      it "空のedgesを返すこと" do
        json = subject

        expect(json[:errors]).to be_nil
        expect(json[:data][:followers][:edges]).to eq([])
      end
    end

    context "フォロワーがいる場合" do
      let!(:follower1) { create(:user, name: "Follower 1") }
      let!(:follower2) { create(:user, name: "Follower 2") }
      let!(:other_user) { create(:user, name: "Other User") }

      before do
        create(:follow, follower: follower1, followee: current_user, created_at: 2.days.ago)
        create(:follow, follower: follower2, followee: current_user, created_at: 1.day.ago)
      end

      it "フォローされた順序の降順で返すこと" do
        json = subject

        expect(json[:errors]).to be_nil

        edges = json[:data][:followers][:edges]
        expect(edges.size).to eq(2)

        # 最新のフォローが最初に来る
        expect(edges[0][:node][:name]).to eq("Follower 2")
        expect(edges[1][:node][:name]).to eq("Follower 1")
      end

      it "ユーザー情報が含まれること" do
        json = subject

        node = json[:data][:followers][:edges][0][:node]

        expect(node).to include(
          :id,
          :name,
          :profileText,
          :avatarUrl,
          :isFollowing,
          :createdAt
        )
      end

      it "他のユーザーのフォロワーは含まれないこと" do
        # other_userをフォローしているユーザーを作成
        another_follower = create(:user)
        create(:follow, follower: another_follower, followee: other_user)

        json = subject

        edges = json[:data][:followers][:edges]

        # current_userのフォロワーのみ（2件）
        expect(edges.size).to eq(2)
      end
    end

    context "フォロワーがアバターを持っている場合" do
      let!(:follower) { create(:user) }

      before do
        follower.avatar.attach(
          io: File.open(Rails.root.join("spec/fixtures/images/test.png")),
          filename: "test.png",
          content_type: "image/png"
        )
        create(:follow, follower: follower, followee: current_user)
      end

      it "avatarUrlが返ること" do
        json = subject

        node = json[:data][:followers][:edges][0][:node]
        expect(node[:avatarUrl]).to be_present
      end
    end

    context "connection paginationのサポート" do
      let!(:followers) { create_list(:user, 5) }

      before do
        followers.each do |follower|
          create(:follow, follower: follower, followee: current_user)
        end
      end

      it "connection typeの構造で返すこと" do
        json = subject

        expect(json[:errors]).to be_nil

        connection = json[:data][:followers]
        expect(connection[:edges]).to be_an(Array)
        expect(connection[:edges].size).to eq(5)
        expect(connection[:pageInfo]).to be_present
      end

      it "各edgeにcursorが含まれること" do
        json = subject

        edges = json[:data][:followers][:edges]

        edges.each do |edge|
          expect(edge[:cursor]).to be_present
          expect(edge[:node]).to be_present
        end
      end
    end
  end
end
