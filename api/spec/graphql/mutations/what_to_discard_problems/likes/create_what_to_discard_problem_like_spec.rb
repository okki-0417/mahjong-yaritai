# frozen_string_literal: true

require "rails_helper"

RSpec.describe Mutations::WhatToDiscardProblems::Likes::CreateWhatToDiscardProblemLike, type: :request do
  include GraphqlHelper

  describe "resolve" do
    subject do
      execute_mutation(mutation, variables, context: { current_user: })
      JSON.parse(response.body, symbolize_names: true)
    end

    let(:current_user) { create(:user) }
    let(:problem) { create(:what_to_discard_problem) }
    let(:variables) { { problemId: problem.id.to_s } }
    let(:mutation) do
      <<~GQL
        mutation($problemId: ID!) {
          createWhatToDiscardProblemLike(input: { problemId: $problemId }) {
            like {
              id
              userId
              likableId
              likableType
            }
          }
        }
      GQL
    end

    context "ログインしていない場合" do
      let(:current_user) { nil }

      it "エラーが返ること" do
        json = subject

        expect(json[:data][:createWhatToDiscardProblemLike]).to be_nil
        expect(json[:errors].any?).to be true
      end
    end

    context "ログインしている場合" do
      context "保存に失敗した場合" do
        before do
          errors = double(full_messages: [ "バリデーションエラー" ])
          like = instance_double(Like, save: false, errors:)
          allow(current_user.created_likes).to receive(:new).and_return(like)
        end

        it "バリデーションエラーが返ること" do
          json = subject

          expect(json[:data][:createWhatToDiscardProblemLike]).to be_nil
          expect(json[:errors].any?).to be true
        end
      end

      context "保存に成功した場合" do
        it "いいねが作成できること" do
          json = subject

          expect(json[:data][:createWhatToDiscardProblemLike][:like]).to be_present
        end
      end
    end
  end
end
