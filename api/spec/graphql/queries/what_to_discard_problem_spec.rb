# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Queries::WhatToDiscardProblem", type: :request do
  include GraphqlHelper

  describe "whatToDiscardProblem" do
    subject do
      execute_query(query, variables, context: { current_user: })
      JSON.parse(response.body, symbolize_names: true)
    end

    let(:current_user) { nil }
    let!(:problem) { create(:what_to_discard_problem) }
    let(:variables) { { id: problem.id.to_s } }
    let(:query) do
      <<~GQL
        query($id: ID!) {
          whatToDiscardProblem(id: $id) {
            id
            round
            turn
            wind
            points
            description
            votesCount
            commentsCount
            likesCount
            doraId
            hand1Id
            hand2Id
            hand3Id
            tsumoId
            user {
              id
              name
              avatarUrl
            }
            createdAt
            updatedAt
          }
        }
      GQL
    end

    it "問題情報を返すこと" do
      json = subject

      expect(json[:errors]).to be_nil
      expect(json[:data][:whatToDiscardProblem]).to be_present
    end
  end
end
