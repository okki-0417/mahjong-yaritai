# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Queries::CurrentSession", type: :request do
  include GraphqlHelper

  describe "currentSession" do
    subject do
      execute_query(query, variables, context: { current_user: })
      JSON.parse(response.body, symbolize_names: true)
    end

    let(:variables) { {} }
    let(:query) do
      <<~GQL
        query {
          currentSession {
            isLoggedIn
            user {
              id
              name
              avatarUrl
            }
          }
        }
      GQL
    end

    context "ログインしていない場合" do
      let(:current_user) { nil }

      it "isLoggedIn: falseを返すこと" do
        json = subject

        expect(json[:errors]).to be_nil
        expect(json[:data][:currentSession][:isLoggedIn]).to eq(false)
        expect(json[:data][:currentSession][:user]).to be_nil
      end
    end

    context "ログインしている場合" do
      let(:current_user) { create(:user, name: "Test User") }

      it "ユーザー情報を返すこと" do
        json = subject

        expect(json[:errors]).to be_nil
        expect(json[:data][:currentSession][:isLoggedIn]).to eq(true)
        expect(json[:data][:currentSession][:user][:id]).to eq(current_user.id.to_s)
        expect(json[:data][:currentSession][:user][:name]).to eq(current_user.name)
      end
    end

    context "アバターがある場合" do
      let(:current_user) { create(:user) }

      before do
        current_user.avatar.attach(
          io: File.open(Rails.root.join("spec/fixtures/images/test.png")),
          filename: "test.png",
          content_type: "image/png"
        )
      end

      it "avatarUrlを返すこと" do
        json = subject

        expect(json[:data][:currentSession][:user][:avatarUrl]).to be_present
      end
    end
  end
end
