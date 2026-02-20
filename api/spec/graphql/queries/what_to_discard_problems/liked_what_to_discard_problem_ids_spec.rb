# frozen_string_literal: true

require "rails_helper"

RSpec.describe Resolvers::WhatToDiscardProblems::LikedWhatToDiscardProblemIds, type: :request do
  include GraphqlHelper

  describe "LikedWhatToDiscardProblemIds" do
    subject do
      execute_query(query, variables, context: { current_user: current_user })
      JSON.parse(response.body)
    end

    let(:query) do
      <<-GRAPHQL
        query($whatToDiscardProblemIds: [ID!]!) {
          likedWhatToDiscardProblemIds(whatToDiscardProblemIds: $whatToDiscardProblemIds)
        }
      GRAPHQL
    end
    let(:variables) do
      { whatToDiscardProblemIds: what_to_discard_problem_ids }
    end
    let(:what_to_discard_problem_ids) { what_to_discard_problems.map { |p| p.id } }
    let(:what_to_discard_problems) { create_list(:what_to_discard_problem, 3) }
    let(:current_user) { nil }

    context "ログインしていない場合" do
      it "空の配列を返すこと" do
        json = subject
        expect(json["data"]["likedWhatToDiscardProblemIds"]).to eq []
      end
    end

    context "ログインしている場合" do
      let(:current_user) { create(:user) }

      before do
        create(:like, user: current_user, likable: what_to_discard_problems[0])
        create(:like, user: current_user, likable: what_to_discard_problems[2])
      end

      it "いいねしている問題のIDを配列で返すこと" do
        json = subject
        expect(json["data"]["likedWhatToDiscardProblemIds"]).to match_array [
          what_to_discard_problems[0].id.to_s,
          what_to_discard_problems[2].id.to_s,
        ]
      end
    end
  end
end
