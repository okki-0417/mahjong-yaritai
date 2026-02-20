# frozen_string_literal: true

require "rails_helper"

RSpec.describe Resolvers::WhatToDiscardProblems::VotedTileIds, type: :request do
  include GraphqlHelper

  describe "VotedTileIds" do
    subject do
      execute_query(query, variables, context: { current_user: current_user })
      JSON.parse(response.body)
    end

    let(:query) do
      <<-GRAPHQL
        query($whatToDiscardProblemIds: [ID!]!) {
          votedTileIds(whatToDiscardProblemIds: $whatToDiscardProblemIds) {
            tileId
            whatToDiscardProblemId
          }
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
        expect(json["data"]["votedTileIds"]).to eq []
      end
    end

    context "ログインしている場合" do
      let(:current_user) { create(:user) }

      before do
        create(:what_to_discard_problem_vote, user: current_user, what_to_discard_problem: what_to_discard_problems[0])
        create(:what_to_discard_problem_vote, user: current_user, what_to_discard_problem: what_to_discard_problems[2])
      end

      it "投票している牌のIDと問題のIDのペアの配列を返すこと" do
        json = subject
        expect(json["data"]["votedTileIds"]).to match_array [
          {
            "tileId" => what_to_discard_problems[0].votes.find { |v| v.voted_by?(current_user) }.tile_id.to_s,
            "whatToDiscardProblemId" => what_to_discard_problems[0].id.to_s,
          },
          {
            "tileId" => what_to_discard_problems[2].votes.find { |v| v.voted_by?(current_user) }.tile_id.to_s,
            "whatToDiscardProblemId" => what_to_discard_problems[2].id.to_s,
          },
        ]
      end
    end
  end
end
