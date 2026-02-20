# frozen_string_literal: true

require "rails_helper"

RSpec.describe Mutations::WhatToDiscardProblems::Likes::DeleteWhatToDiscardProblemLike, type: :request do
  include GraphqlHelper

  describe "resolve" do
    subject do
      execute_mutation(mutation, variables, context: { current_user: })
      JSON.parse(response.body, symbolize_names: true)
    end

    let(:current_user) { create(:user) }
    let(:problem) { create(:what_to_discard_problem) }
    let(:like) { create(:like, likable: problem, user: current_user) }
    let(:variables) { { whatToDiscardProblemId: problem.id.to_s } }
    let(:mutation) do
      <<~GQL
        mutation($whatToDiscardProblemId: ID!) {
          deleteWhatToDiscardProblemLike(input: { whatToDiscardProblemId: $whatToDiscardProblemId }) {
            id
          }
        }
      GQL
    end

    context "ログインしていない場合" do
      let(:current_user) { nil }

      it "エラーが返ること" do
        json = subject

        expect(json[:data][:deleteWhatToDiscardProblemLike]).to be_nil
        expect(json[:errors].any?).to be true
      end
    end

    context "ログインしている場合" do
      before { like }

      context "削除が成功する場合" do
        it "いいねが削除できること" do
          json = subject

          expect(json[:data][:deleteWhatToDiscardProblemLike][:id]).to be_present
        end
      end
    end
  end
end
