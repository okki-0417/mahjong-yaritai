# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Queries::User", type: :request do
  include GraphqlHelper

  describe "user" do
    subject do
      execute_query(query, variables, context: { current_user: })
      JSON.parse(response.body, symbolize_names: true)
    end

    let(:target_user) { create(:user, name: "Test User") }
    let(:current_user) { nil }
    let(:variables) { { id: target_user.id.to_s } }
    let(:query) do
      <<~GQL
        query($id: ID!) {
          user(id: $id) {
            id
            name
            profileText
            avatarUrl
            isFollowing
          }
        }
      GQL
    end

    context "ユーザーが存在する場合" do
      it "ユーザー情報を返すこと" do
        json = subject

        expect(json[:errors]).to be_nil
        expect(json[:data][:user][:id]).to eq(target_user.id.to_s)
        expect(json[:data][:user][:name]).to eq("Test User")
        expect(json[:data][:user][:profileText]).to eq(target_user.profile_text)
      end
    end

    context "アバターがある場合" do
      before do
        target_user.avatar.attach(
          io: File.open(Rails.root.join("spec/fixtures/images/test.png")),
          filename: "test.png",
          content_type: "image/png"
        )
      end

      it "avatarUrlを返すこと" do
        json = subject

        expect(json[:data][:user][:avatarUrl]).to be_present
      end
    end

    context "ログインしていない場合" do
      it "isFollowing: nilを返すこと" do
        json = subject

        expect(json[:data][:user][:isFollowing]).to eq(nil)
      end
    end

    context "ログインしている場合" do
      let(:current_user) { create(:user) }

      context "フォローしていない場合" do
        it "isFollowing: falseを返すこと" do
          json = subject

          expect(json[:data][:user][:isFollowing]).to eq(false)
        end
      end

      context "フォローしている場合" do
        before do
          create(:follow, follower: current_user, followee: target_user)
        end

        it "isFollowing: trueを返すこと" do
          json = subject

          expect(json[:data][:user][:isFollowing]).to eq(true)
        end
      end
    end
  end
end
