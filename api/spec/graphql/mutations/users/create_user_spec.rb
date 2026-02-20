# frozen_string_literal: true

require "rails_helper"

RSpec.describe Mutations::Users::CreateUser, type: :request do
  include GraphqlHelper

  describe "resolve" do
    subject do
      execute_mutation(mutation, variables, context:)
      JSON.parse(response.body, symbolize_names: true)
    end

    let(:mutation) do
      <<~GQL
        mutation($name: String!, $profileText: String, $avatar: Upload) {
          createUser(input: {
            name: $name
            profileText: $profileText
            avatar: $avatar
          }) {
            user {
              id
              email
              name
              profileText
            }
          }
        }
      GQL
    end
    let(:variables) { { name:, profile_text: } }
    let(:name) { "Test User" }
    let(:profile_text) { "This is a test user." }
    let(:context) { { session: } }
    let(:session) { { auth_request_id: auth_request.id } }
    let(:auth_request) { create(:auth_request, email:) }
    let(:email) { "xxx@xxx.com" }

    context "セッションが無効な場合" do
      let(:session) { {} }

      it "エラーが返ること" do
        json = subject

        expect(json[:data][:createUser]).to be_nil
        expect(json[:errors].any?).to be true
      end
    end

    context "保存に失敗した場合" do
      before do
        errors = double(full_messages: [ "エラーメッセージ" ])
        user = instance_double(User, save: false, errors:)
        allow(User).to receive(:new).and_return(user)
        allow(user).to receive(:avatar).and_return(double(attach: nil))
      end

      it "エラーメッセージが返ること" do
        json = subject

        expect(json[:data][:createUser]).to be_nil
        expect(json[:errors].any?).to be true
      end
    end

    context "保存に成功した場合" do
      it "ユーザーが作成されること" do
        json = subject

        expect(json[:data][:createUser]).to be_present
      end
    end
  end
end
