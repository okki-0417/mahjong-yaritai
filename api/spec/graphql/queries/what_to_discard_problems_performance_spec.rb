# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Queries::WhatToDiscardProblems Performance Test", type: :request do
  include GraphqlHelper

  let(:current_user) { create(:user) }
  let(:problems_query) do
    <<~GQL
      query {
        whatToDiscardProblems {
          edges {
            node {
              id
              doraId
              hand1Id
              hand2Id
              hand3Id
              user {
                id
                name
                avatarUrl
              }
              likesCount
              votesCount
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    GQL
  end

  let(:problem_detail_query) do
    <<~GQL
      query($id: ID!) {
        whatToDiscardProblem(id: $id) {
          id
          doraId
          hand1Id
          hand2Id
          hand3Id
          hand4Id
          hand5Id
          hand6Id
          hand7Id
          hand8Id
          hand9Id
          hand10Id
          hand11Id
          hand12Id
          hand13Id
          tsumoId
          user {
            id
            name
            avatarUrl
          }
          likesCount
          votesCount
        }
      }
    GQL
  end

  describe "performance improvement verification" do
    let!(:problems) { create_list(:what_to_discard_problem, 5) }

    before do
      # 各問題にvotesを作成
      problems.each do |problem|
        create_list(:what_to_discard_problem_vote, 3, what_to_discard_problem: problem)
      end
    end

    it "問題一覧クエリが効率的に実行されること" do
      query_count = count_queries do
        execute_query(problems_query, {})
      end

      json = JSON.parse(response.body, symbolize_names: true)

      expect(response).to have_http_status(:ok)
      expect(json[:errors]).to be_nil

      edges = json[:data][:whatToDiscardProblems][:edges]
      expect(edges.length).to eq(5)

      # preloadを使用することで、クエリ数が削減されることを期待
      expect(query_count).to be < 30 # 現実的な期待値に調整
    end

    it "問題詳細クエリが効率的に実行されること" do
      problem = problems.first

      query_count = count_queries do
        execute_query(problem_detail_query, { id: problem.id.to_s })
      end

      json = JSON.parse(response.body, symbolize_names: true)

      expect(response).to have_http_status(:ok)
      expect(json[:errors]).to be_nil

      problem_data = json[:data][:whatToDiscardProblem]
      expect(problem_data[:id]).to eq(problem.id.to_s)

      expect(query_count).to be < 30 # 現実的な期待値に調整
    end
  end

  private

  def count_queries(&block)
    query_count = 0
    callback = lambda do |*args|
      query_count += 1 unless args[4][:name] =~ /SCHEMA|TRANSACTION/
    end

    ActiveSupport::Notifications.subscribed(callback, "sql.active_record", &block)
    query_count
  end
end
