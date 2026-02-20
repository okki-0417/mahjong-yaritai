# frozen_string_literal: true

require "rails_helper"

RSpec.describe Mutations::Users::WithdrawUser, type: :request do
  include GraphqlHelper

  describe "resolve" do
    subject do
      execute_mutation(mutation, nil, context: { current_user: })
      JSON.parse(response.body, symbolize_names: true)
    end

    let(:mutation) do
      <<~GQL
        mutation {
          withdrawUser(input: {}) {
            success
          }
        }
      GQL
    end
    let(:current_user) { create(:user) }

    context "ログインしていない場合" do
      let(:current_user) { nil }

      it "エラーが返ること" do
        json = subject

        expect(json[:data][:withdrawUser]).to be_nil
        expect(json[:errors].any?).to be true
      end
    end

    context "削除が失敗する場合" do
      before do
        errors = double(full_messages: [ "削除エラー" ])
        allow(current_user).to receive(:destroy).and_return(false)
        allow(current_user).to receive(:errors).and_return(errors)
      end

      it "エラーが返ること" do
        json = subject

        expect(json[:data][:withdrawUser]).to be_nil
        expect(json[:errors].any?).to be true
      end
    end

    context "削除が成功する場合" do
      before { current_user }
      it "ユーザーが退会できること" do
        expect {
          json = subject
          expect(json[:data][:withdrawUser][:success]).to eq(true)
        }.to change(User, :count).by(-1)
      end
    end
  end
end
