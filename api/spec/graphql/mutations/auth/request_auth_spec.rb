# frozen_string_literal: true

require "rails_helper"

RSpec.describe Mutations::Auth::RequestAuth, type: :request do
  include GraphqlHelper

  describe "resolve" do
    subject do
      execute_mutation(mutation, variables, context: { current_user:, session: })
      JSON.parse(response.body, symbolize_names: true)
    end

    let(:session) { {} }
    let(:current_user) { nil }
    let(:email) { "test@example.com" }
    let(:variables) { { email: } }
    let(:mutation) do
      <<~GQL
        mutation($email: String!) {
          requestAuth(input: { email: $email }) {
            success
          }
        }
      GQL
    end

    context "既にログインしている場合" do
      let(:current_user) { create(:user) }

      it "エラーが返ること" do
        json = subject

        expect(json[:data][:requestAuth]).to be_nil
        expect(json[:errors].any?).to be true
      end
    end

    context "保存に失敗した場合" do
      before do
        errors = double(full_messages: %w[バリデーションエラー1 バリデーションエラー2])
        auth_request = instance_double(AuthRequest, save: false, errors:)
        allow(AuthRequest).to receive(:new).and_return(auth_request)
      end

      it "バリデーションエラーが返ること" do
        json = subject

        expect(json[:data][:requestAuth]).to be_nil
        expect(json[:errors].any?).to be true
      end
    end

    context "保存に成功した場合" do
      it "認証メールが送信され、sessionにメールアドレスが保存されること" do
        expect { subject }.to change(AuthorizationMailer.deliveries, :count).by(1)

        json = subject
        expect(session[:pending_auth_email]).to eq(email)
        expect(json[:data][:requestAuth][:success]).to eq(true)
      end
    end
  end
end
