# frozen_string_literal: true

require "rails_helper"

RSpec.describe Resolvers::Me::WhatToDiscardProblems::VotedWhatToDiscardProblems, type: :request do
  include GraphqlHelper

  describe "voted_what_to_discard_problems" do
    subject do
      execute_query(query, context: { current_user: current_user })
      JSON.parse(response.body, symbolize_names: true)
    end

    let(:query) do
      <<-GRAPHQL
      query($after: String, $first: Int) {
        votedWhatToDiscardProblems(after: $after, first: $first) {
          edges {
            node {
              id
              description
              points
              round
              turn
              wind
              hand1Id
              hand2Id
              hand3Id
              hand4Id
              hand5Id
              doraId
              tsumoId
              user {
                id
                name
              }
              isLikedByMe
              myVoteTileId
              createdAt
              updatedAt
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
      GRAPHQL
    end
    let(:current_user) { create(:user) }

    context "ログインしていない場合" do
      let(:current_user) { nil }

      it "空の配列が返ること" do
        json = subject
        expect(json[:data][:votedWhatToDiscardProblems][:edges]).to eq([])
      end
    end

    context "ログインしている場合" do
      let(:problem1) { create(:what_to_discard_problem) }
      let(:problem2) { create(:what_to_discard_problem) }
      let(:problem3) { create(:what_to_discard_problem) }

      before do
        create(:what_to_discard_problem_vote, user: current_user, what_to_discard_problem: problem1)
        create(:what_to_discard_problem_vote, user: current_user, what_to_discard_problem: problem3)
      end

      it "自分が投票した問題が返ること" do
        json = subject
        returned_problem_ids = json[:data][:votedWhatToDiscardProblems][:edges].map { |edge| edge[:node][:id].to_i }
        expect(returned_problem_ids).to eq([ problem3.id, problem1.id ])
        expect(json[:data][:votedWhatToDiscardProblems][:edges][0][:node][:myVoteTileId]).to eq(problem3.votes.find_by(user: current_user).tile_id.to_s)
        expect(json[:data][:votedWhatToDiscardProblems][:edges][1][:node][:myVoteTileId]).to eq(problem1.votes.find_by(user: current_user).tile_id.to_s)
      end
    end
  end
end
