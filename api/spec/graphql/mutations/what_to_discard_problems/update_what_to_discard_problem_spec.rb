# frozen_string_literal: true

require "rails_helper"

RSpec.describe Mutations::WhatToDiscardProblems::UpdateWhatToDiscardProblem, type: :request do
  include GraphqlHelper

  describe "resolve" do
    subject do
      execute_mutation(mutation, variables, context: { current_user: })
      JSON.parse(response.body, symbolize_names: true)
    end

    let(:current_user) { create(:user) }
    let(:problem) { create(:what_to_discard_problem, user: current_user) }
    let(:variables) do
      {
        id: problem.id.to_s,
        description: "更新されたテスト問題",
      }
    end
    let(:mutation) do
      <<~GQL
        mutation($id: ID!, $description: String) {
          updateWhatToDiscardProblem(input: {
            id: $id
            description: $description
          }) {
            whatToDiscardProblem {
              id
              description
              user {
                id
                name
                avatarUrl
              }
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

        expect(json[:data][:updateWhatToDiscardProblem]).to be_nil
        expect(json[:errors].any?).to be true
      end
    end

    context "ログインしている場合" do
      context "保存に失敗した場合" do
        before do
          errors = double(full_messages: [ "バリデーションエラー" ])
          problem_double = instance_double(WhatToDiscardProblem, update: false, errors:)
          allow(current_user.created_what_to_discard_problems).to receive(:find).and_return(problem_double)
        end

        it "バリデーションエラーが返ること" do
          json = subject

          expect(json[:data][:updateWhatToDiscardProblem]).to be_nil
          expect(json[:errors].any?).to be true
        end
      end

      context "保存に成功した場合" do
        it "問題が更新できること" do
          json = subject

          expect(json[:data][:updateWhatToDiscardProblem][:whatToDiscardProblem]).to be_present
        end
      end
    end
  end
end
