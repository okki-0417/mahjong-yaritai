# frozen_string_literal: true

require "rails_helper"

RSpec.describe Mutations::Follows::CreateFollow, type: :request do
  include GraphqlHelper

  describe "resolve" do
    subject do
      execute_mutation(mutation, variables, context:)
      JSON.parse(response.body, symbolize_names: true)
    end

    let(:mutation) do
      <<~GQL
        mutation($userId: ID!) {
          createFollow(input: { userId: $userId }) {
            follow {
              id
              followeeId
              followerId
            }
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

      it "エラーを返ること" do
        json = subject

        expect(json[:data][:createFollow]).to be_nil
        expect(json[:errors].any?).to be true
      end
    end

    context "ログインしている場合" do
      context "保存に失敗した場合" do
        before do
          errors = double(full_messages: [ "バリデーションエラー" ])
          follow = instance_double(Follow, save: false, errors:)
          allow(current_user.active_follows).to receive(:new).and_return(follow)
        end

        it "バリデーションエラーを返すこと" do
          json = subject

          expect(json[:data][:createFollow]).to be_nil
          expect(json[:errors].any?).to be true
        end
      end

      context "保存に成功した場合" do
        it "データが正しく返ること" do
          json = subject

          expect(json[:data][:createFollow][:follow]).to be_present
        end
      end
    end
  end
end
