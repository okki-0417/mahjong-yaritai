# frozen_string_literal: true

require "rails_helper"

RSpec.describe Mutations::WhatToDiscardProblems::Comments::DeleteWhatToDiscardProblemComment, type: :request do
  include GraphqlHelper

  describe "resolve" do
    subject do
      execute_mutation(mutation, variables, context: { current_user: })
      JSON.parse(response.body, symbolize_names: true)
    end

    let(:current_user) { create(:user) }
    let(:problem) { create(:what_to_discard_problem) }
    let(:comment) { create(:comment, commentable: problem, user: current_user) }
    let(:variables) { { commentId: comment.id.to_s } }
    let(:mutation) do
      <<~GQL
        mutation($commentId: ID!) {
          deleteWhatToDiscardProblemComment(input: { commentId: $commentId }) {
            id
          }
        }
      GQL
    end

    context "ログインしていない場合" do
      let(:comment) { create(:comment, commentable: problem) }
      let(:current_user) { nil }

      it "エラーが返ること" do
        json = subject

        expect(json[:data][:deleteWhatToDiscardProblemComment]).to be_nil
        expect(json[:errors].any?).to be true
      end
    end

    context "ログインしている場合" do
      context "削除が成功する場合" do
        it "コメントが削除できること" do
          json = subject

          expect(json[:data][:deleteWhatToDiscardProblemComment][:id]).to be_present
        end
      end
    end
  end
end
