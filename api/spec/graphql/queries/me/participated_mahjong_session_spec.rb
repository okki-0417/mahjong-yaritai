# frozen_string_literal: true

require "rails_helper"

RSpec.describe Resolvers::Me::ParticipatedMahjongSession, type: :request do
  include GraphqlHelper

  subject do
    execute_query(query, variables, context: { current_user: })
    JSON.parse(response.body, symbolize_names: true)
  end

  let(:query) do
    <<-GRAPHQL
      query($id: ID!) {
        participatedMahjongSession(id: $id) {
          id
          name
          creatorUser {
            id
            name
            avatarUrl
          }
          mahjongScoringSetting {
            id
            rate
            chipAmount
            umaRuleLabel
            okaRuleLabel
          }
          mahjongParticipants {
            id
            userId
            name
            averageRanking
            totalPoints
            totalProfits
            user {
              id
              name
              avatarUrl
            }
          }
          mahjongGames {
            id
            mahjongResults {
              id
              ranking
              score
              resultPoints
              mahjongParticipantId
            }
          }
          createdAt
          updatedAt
        }
      }
    GRAPHQL
  end
  let(:variables) { { id: } }
  let(:id) { mahjong_session.id.to_s }

  context "ログインしていない場合" do
    let(:current_user) { nil }
    let(:mahjong_session) { create(:mahjong_session) }

    it "エラーが返ること" do
      json = subject
      expect(json[:errors]).to be_present
    end
  end

  context "ログインしている場合" do
    let(:current_user) { create(:user, name:) }
    let(:name) { "参加者ユーザー" }

    context "参加していない麻雀セッションの場合" do
      let(:mahjong_session) { create(:mahjong_session) }

      it "エラーが返ること" do
        json = subject
        expect(json[:errors]).to be_present
      end
    end

    context "参加した麻雀セッションの場合" do
      let(:mahjong_session) { create(:mahjong_session, mahjong_scoring_setting:) }
      let(:mahjong_scoring_setting) { create(:mahjong_scoring_setting, rate:) }
      let(:rate) { 100 }
      let!(:participant) { create(:mahjong_participant, user: current_user, mahjong_session:) }

      it "麻雀セッションの情報が返ること" do
        json = subject
        expect(json[:data]).to be_present

        data = json[:data][:participatedMahjongSession]
        expect(data[:id]).to eq(mahjong_session.id.to_s)
        expect(data[:creatorUser][:id]).to eq(mahjong_session.creator_user.id.to_s)
        expect(data[:mahjongScoringSetting][:id]).to eq(mahjong_session.mahjong_scoring_setting.id.to_s)
      end

      context "ゲームをプレイしている場合" do
        before do
          game1 = create(:mahjong_game, mahjong_session:)
          create(:mahjong_result, mahjong_game: game1, mahjong_participant: participant, score: 25000, result_points: 25, ranking: 1)

          game2 = create(:mahjong_game, mahjong_session:)
          create(:mahjong_result, mahjong_game: game2, mahjong_participant: participant, score: 32000, result_points: 15, ranking: 2)

          game3 = create(:mahjong_game, mahjong_session:)
          create(:mahjong_result, mahjong_game: game3, mahjong_participant: participant, score: 18000, result_points: -10, ranking: 3)
        end

        let(:total_points) { 25 + 15 + (-10) }
        let(:average_ranking) { ((1 + 2 + 3) / 3.0).round(2) }
        let(:total_profit) { (25 + 15 + (-10)) * rate }

        it "集計結果が正しく返ること" do
          json = subject
          expect(json[:data]).to be_present

          data = json[:data][:participatedMahjongSession]
          expect(data[:mahjongParticipants][0][:name]).to eq(name)
          expect(data[:mahjongParticipants][0][:totalPoints]).to eq(total_points)
          expect(data[:mahjongParticipants][0][:averageRanking]).to eq(average_ranking)
          expect(data[:mahjongParticipants][0][:totalProfits]).to eq(total_profit)
        end
      end
    end
  end
end
