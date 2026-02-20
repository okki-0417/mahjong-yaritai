# frozen_string_literal: true

require "rails_helper"

RSpec.describe Resolvers::Me::ParticipatedMahjongSessions, type: :request do
  include GraphqlHelper

  subject do
    execute_query(query, context: { current_user: })
    JSON.parse(response.body, symbolize_names: true)
  end

  let(:query) do
    <<-GRAPHQL
        query {
          participatedMahjongSessions(first: 10) {
            edges {
              node {
                id
                myTotalPoints
                myAverageRanking
                myTotalProfits
                name
                totalGameFee
                creatorUser {
                  id
                  name
                }
                mahjongScoringSetting {
                  id
                  rate
                  chipAmount
                }
              }
            }
          }
        }
      GRAPHQL
  end

  context "ログインしていない場合" do
    let(:current_user) { nil }

    it "エラーが返ること" do
      json = subject
      expect(json[:errors]).to be_present
    end
  end

  context "ログインしている場合" do
    let(:current_user) { create(:user) }

    context "参加した麻雀セッションがない場合" do
      it "空の配列が返ること" do
        json = subject
        expect(json[:data][:participatedMahjongSessions][:edges]).to eq []
      end
    end

    context "参加した麻雀セッションが存在している場合" do
      let!(:mahjong_session1) { create(:mahjong_session, mahjong_scoring_setting:) }
      let!(:mahjong_session2) { create(:mahjong_session, mahjong_scoring_setting:) }
      let!(:mahjong_session3) { create(:mahjong_session, mahjong_scoring_setting:) }
      let(:mahjong_scoring_setting) { create(:mahjong_scoring_setting, rate:) }
      let(:rate) { 100 }

      let!(:session1_participant) { create(:mahjong_participant, user: current_user, mahjong_session: mahjong_session1) }
      let!(:session2_participant) { create(:mahjong_participant, user: current_user, mahjong_session: mahjong_session2) }

      it "参加した麻雀セッションの一覧が返ること" do
        json = subject
        returned_ids = json[:data][:participatedMahjongSessions][:edges].map { |edge| edge[:node][:id] }
        expect(returned_ids).to match_array([ mahjong_session1.id.to_s, mahjong_session2.id.to_s ])
      end

      context "何ゲームかプレイしている場合" do
        before do
          # session1のゲーム（1ゲーム）
          create(:mahjong_game, mahjong_session: mahjong_session1) do |mahjong_game|
            create(:mahjong_result, mahjong_game:, mahjong_participant: session1_participant, score: 25000, result_points: 25, ranking: 1)
            create(:mahjong_result, mahjong_game:, mahjong_participant: session2_participant, score: 20000, result_points: -15, ranking: 3)
          end

          # session2のゲーム（2ゲーム）
          create(:mahjong_game, mahjong_session: mahjong_session2) do |mahjong_game|
            create(:mahjong_result, mahjong_game:, mahjong_participant: session1_participant, score: 32000, result_points: 15, ranking: 2)
            create(:mahjong_result, mahjong_game:, mahjong_participant: session2_participant, score: 18000, result_points: 30, ranking: 4)
          end

          create(:mahjong_game, mahjong_session: mahjong_session2) do |mahjong_game|
            create(:mahjong_result, mahjong_game:, mahjong_participant: session1_participant, score: 28000, result_points: 0, ranking: 4)
            create(:mahjong_result, mahjong_game:, mahjong_participant: session2_participant, score: 32000, result_points: 15, ranking: 2)
          end
        end

        let(:session1_total_points) { 25 + 15 + 0 } # 40
        let(:session2_total_points) { -15 + 30 + 15 } # 30
        let(:session1_average_ranking) { ((1 + 2 + 4) / 3.0).round(2) } # 2.33
        let(:session2_average_ranking) { ((3 + 4 + 2) / 3.0).round(2) } # 3.0
        let(:session1_total_profit) { (25 + 15 + 0) * rate } # 4000
        let(:session2_total_profit) { (-15 + 30 + 15) * rate } # 3000

        it "集計結果が正しく返ること" do
          json = subject
          edges = json[:data][:participatedMahjongSessions][:edges]
          session1_data = edges.find { |edge| edge[:node][:id] == mahjong_session1.id.to_s }
          session2_data = edges.find { |edge| edge[:node][:id] == mahjong_session2.id.to_s }

          expect(session1_data[:node][:myTotalPoints]).to eq(session1_total_points)
          expect(session2_data[:node][:myTotalPoints]).to eq(session2_total_points)

          expect(session1_data[:node][:myAverageRanking]).to eq(session1_average_ranking)
          expect(session2_data[:node][:myAverageRanking]).to eq(session2_average_ranking)

          expect(session1_data[:node][:myTotalProfits]).to eq(session1_total_profit)
          expect(session2_data[:node][:myTotalProfits]).to eq(session2_total_profit)
        end
      end
    end
  end
end
