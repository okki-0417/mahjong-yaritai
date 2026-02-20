# frozen_string_literal: true

require "rails_helper"

RSpec.describe Mutations::Users::UpdateUser, type: :request do
  include GraphqlHelper

  describe "resolve" do
    subject do
      execute_mutation(mutation, variables, context: { current_user: })
      JSON.parse(response.body, symbolize_names: true)
    end

    let(:mutation) do
      <<~GQL
        mutation($name: String!, $profileText: String!, $avatar: Upload) {
          updateUser(input: { name: $name, profileText: $profileText, avatar: $avatar }) {
            user {
              id
              name
              profileText
            }
          }
        }
      GQL
    end
    let(:current_user) { create(:user) }
    let(:variables) { { name: "Updated Name", profileText: "Updated profile" } }

    context "ログインしていない場合" do
      let(:current_user) { nil }

      it "エラーが返ること" do
        json = subject

        expect(json[:data][:updateUser]).to be_nil
        expect(json[:errors].any?).to be true
      end
    end

    context "ログインしている場合" do
      context "更新が失敗する場合" do
        before do
          errors = double(full_messages: [ "バリデーションエラー" ])
          allow(current_user).to receive(:update).and_return(false)
          allow(current_user).to receive(:errors).and_return(errors)
        end

        it "バリデーションエラーが返ること" do
          json = subject

          expect(json[:data][:updateUser]).to be_nil
          expect(json[:errors].any?).to be true
        end
      end

      context "更新が成功する場合" do
        it "ユーザーが更新されること" do
          json = subject

          expect(json[:data][:updateUser][:user][:name]).to eq("Updated Name")
          expect(json[:data][:updateUser][:user][:profileText]).to eq("Updated profile")
        end
      end
    end
  end
end
