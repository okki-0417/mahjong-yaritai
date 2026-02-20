# frozen_string_literal: true

require "rails_helper"

RSpec.describe Mutations::Follows::DeleteFollow, type: :request do
  include GraphqlHelper

  describe "resolve" do
    subject do
      execute_mutation(mutation, variables, context: { current_user: })
      JSON.parse(response.body, symbolize_names: true)
    end

    let(:mutation) do
      <<~GQL
        mutation($userId: ID!) {
          deleteFollow(input: { userId: $userId }) {
            id
          }
        }
      GQL
    end
    let(:variables) { { userId: target_user.id } }
    let(:target_user) { create(:user) }
    let(:context) { { current_user: } }
    let(:current_user) { create(:user) }

    context "ログインしていない場合" do
      let(:current_user) { nil }

      it "エラーが返ること" do
        json = subject

        expect(json[:data][:deleteFollow]).to be_nil
        expect(json[:errors].any?).to be true
      end
    end

    context "ログインしている場合" do
      before { create(:follow, follower: current_user, followee: target_user) }

      context "削除が成功する場合" do
        it "フォローが削除できること" do
          json = subject

          expect(json[:data][:deleteFollow]).to be_present
        end
      end
    end
  end
end
