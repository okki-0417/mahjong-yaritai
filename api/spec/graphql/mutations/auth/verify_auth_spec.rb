# frozen_string_literal: true

require "rails_helper"

RSpec.describe Mutations::Auth::VerifyAuth, type: :request do
  include GraphqlHelper

  describe "resolve" do
    subject do
      execute_mutation(mutation, variables, context:)
      JSON.parse(response.body, symbolize_names: true)
    end

    let(:mutation) do
      <<~GQL
        mutation($token: String!) {
          verifyAuth(input: { token: $token }) {
            user {
              id
              email
              name
            }
          }
        }
      GQL
    end
    let(:variables) { { token: } }
    let(:token) { "123456" }
    let(:context) { { current_user:, session: } }
    let(:current_user) { nil }
    let(:session) { { pending_auth_email: email } }
    let(:email) { "test@example.com" }

    context "既にログインしている場合" do
      let(:current_user) { create(:user) }

      it "エラーが返ること" do
        json = subject

        expect(json[:data][:verifyAuth]).to be_nil
        expect(json[:errors].any?).to be true
      end
    end

    context "pending_auth_emailがセッションにない場合" do
      let(:email) { nil }

      before { create(:auth_request, token:) }

      it "エラーが返ること" do
        json = subject

        expect(json[:data][:verifyAuth]).to be_nil
        expect(json[:errors].any?).to be true
      end
    end

    context "AuthRequestが存在しない場合" do
      before { allow(AuthRequest).to receive(:find_by).and_return(nil) }

      it "エラーが返ること" do
        json = subject

        expect(json[:data][:verifyAuth]).to be_nil
        expect(json[:errors].any?).to be true
      end
    end

    context "トークンが期限切れの場合" do
      before { create(:auth_request, :expired, email:, token:) }

      it "エラーが返ること" do
        json = subject

        expect(json[:data][:verifyAuth]).to be_nil
        expect(json[:errors].any?).to be true
      end
    end

    context "検証が成功する場合" do
      context "新規ユーザーの場合" do
        before { create(:auth_request, email:, token:) }

        it "userがnilで返ること" do
          json = subject
          expect(json[:data][:verifyAuth][:user]).to be_nil
          expect(session[:pending_auth_email]).to be_nil
        end
      end

      context "既存ユーザーの場合" do
        let(:user) { create(:user, email:) }

        before { create(:auth_request, email: user.email, token:) }

        it "ログインできること" do
          json = subject

          expect(json[:data][:verifyAuth][:user][:id]).to eq(user.id.to_s)
          expect(session[:pending_auth_email]).to be_nil
        end
      end
    end
  end
end
