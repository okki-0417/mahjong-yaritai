# frozen_string_literal: true

require "rails_helper"

RSpec.describe Mutations::WhatToDiscardProblems::Votes::CreateWhatToDiscardProblemVote, type: :request do
  include GraphqlHelper

  describe "resolve" do
    subject do
      execute_mutation(mutation, variables, context: { current_user: })
      JSON.parse(response.body, symbolize_names: true)
    end

    let(:current_user) { create(:user) }
    let(:problem) { create(:what_to_discard_problem) }
    let(:tile) { create(:tile) }
    let(:variables) do
      {
        problemId: problem.id.to_s,
        tileId: tile.id.to_s,
      }
    end
    let(:mutation) do
      <<~GQL
        mutation($problemId: ID!, $tileId: ID!) {
          createWhatToDiscardProblemVote(input: {
            problemId: $problemId
            tileId: $tileId
          }) {
            vote {
              id
              userId
              whatToDiscardProblemId
              tileId
            }
          }
        }
      GQL
    end

    context "ログインしていない場合" do
      let(:problem) { create(:what_to_discard_problem) }
      let(:current_user) { nil }

      it "エラーが返ること" do
        json = subject

        expect(json[:data][:createWhatToDiscardProblemVote]).to be_nil
        expect(json[:errors].any?).to be true
      end
    end

    context "ログインしている場合" do
      context "保存に失敗した場合" do
        before do
          errors = double(full_messages: [ "バリデーションエラー" ])
          vote = instance_double(WhatToDiscardProblem::Vote, save: false, errors:)
          allow(current_user.created_what_to_discard_problem_votes).to receive(:new).and_return(vote)
        end

        it "バリデーションエラーが返ること" do
          json = subject

          expect(json[:data][:createWhatToDiscardProblemVote]).to be_nil
          expect(json[:errors].any?).to be true
        end
      end

      context "保存に成功した場合" do
        it "投票が作成できること" do
          json = subject

          expect(json[:data][:createWhatToDiscardProblemVote][:vote]).to be_present
        end
      end
    end
  end
end
