# frozen_string_literal: true

require "rails_helper"

RSpec.describe Resolvers::Me::MutualFollowers, type: :request do
  include GraphqlHelper

  describe "Query mutual_followers" do
    subject do
      execute_query(query, variables, context: { current_user: })
      JSON.parse(response.body, symbolize_names: true)
    end
    let(:query) do
      <<-GRAPHQL
        query($first: Int, $after: String) {
          mutualFollowers(first: $first, after: $after) {
            edges {
              node {
                id
                name
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
    let(:variables) { { first: 10, after: nil } }

    context "ログインしていない場合" do
      let(:current_user) { nil }

      it "エラーが返ること" do
        json = subject
        expect(json[:errors]).to be_present
      end
    end

    context "ログインしている場合" do
      let(:current_user) { create(:user) }

      context "相互フォロワーが存在する場合" do
        let!(:mutual_followers) do
          create_list(:user, 3).each do |user|
            current_user.follow(user)
            user.follow(current_user)
          end
        end

        it "相互フォロワーが返ること" do
          json = subject
          edges = json.dig(:data, :mutualFollowers, :edges)

          returned_user_ids = edges.map { |edge| edge[:node][:id] }
          expected_user_ids = mutual_followers.map { |user| user.id.to_s }

          expect(returned_user_ids).to match_array(expected_user_ids)
        end
      end
    end
  end
end
