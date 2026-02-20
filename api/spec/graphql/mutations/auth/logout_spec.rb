# frozen_string_literal: true

require "rails_helper"

RSpec.describe Mutations::Auth::Logout, type: :request do
  include GraphqlHelper

  describe "resolve" do
    subject do
      execute_mutation(mutation, nil, context: { current_user:, session:, cookies: })
      JSON.parse(response.body, symbolize_names: true)
    end

    let(:mutation) do
      <<~GQL
        mutation {
          logout(input: {}) {
            success
          }
        }
      GQL
    end
    let(:current_user) { create(:user) }
    let(:session) { { user_id: current_user&.id } }
    let(:cookies) do
      current_user&.remember
      { user_id: current_user&.id, remember_token: current_user&.remember_token }
    end

    context "ログインしていない場合" do
      let(:current_user) { nil }

      it "エラーが返ること" do
        json = subject

        expect(json[:data][:logout]).to be_nil
        expect(json[:errors].any?).to be true
      end
    end

    context "ログインしている場合" do
      it "ログアウトできること" do
        json = subject

        expect(json[:errors]).to be_nil
        expect(json[:data][:logout][:success]).to be true
      end
    end
  end
end
