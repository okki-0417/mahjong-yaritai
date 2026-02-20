# frozen_string_literal: true

require "rails_helper"

RSpec.describe Mutations::MahjongSessions::CreateMahjongSession, type: :request do
  include GraphqlHelper

  describe "resolve" do
    subject do
      execute_mutation(mutation, variables, context:)
      JSON.parse(response.body, symbolize_names: true)
    end

    let(:mutation) do
      <<~GQL
        mutation CreateMahjongSession($input: CreateMahjongSessionInput!) {
          createMahjongSession(input: $input) {
            mahjongSession {
              id
              name
              mahjongScoringSetting {
                rate
                chipAmount
              }
              mahjongParticipants {
                id
                name
                userId
              }
              mahjongGames {
                id
                mahjongResults {
                  ranking
                  resultPoints
                }
              }
            }
          }
        }
      GQL
    end

    let(:context) { { current_user: } }
    let(:variables) do
      {
        input: {
          rate: 100,
          chipAmount: 50,
          createdDate: "2024年12月16日",
          participantUsers: [
            { name: "プレイヤー1" },
            { name: "プレイヤー2" },
            { name: "プレイヤー3" },
          ],
          games: [
            {
              results: [
                { resultPoints: 30, ranking: 1 },
                { resultPoints: 10, ranking: 2 },
                { resultPoints: -40, ranking: 3 },
              ],
            },
          ],
        },
      }
    end

    context "未ログインの場合" do
      let(:current_user) { nil }

      it "エラーが返ること" do
        json = subject

        expect(json[:data][:createMahjongSession]).to be_nil
        expect(json[:errors]).to be_present
        expect(json[:errors].first[:message]).to eq("ログインしてください")
      end
    end

    context "ログイン済みの場合" do
      let(:current_user) { create(:user) }

      context "formオブジェクトが作成に成功する場合" do
        it "mahjongSessionが返ること" do
          json = subject

          expect(json[:errors]).to be_nil
          expect(json[:data][:createMahjongSession][:mahjongSession]).to be_present
        end
      end

      context "formオブジェクトのバリデーションに失敗する場合" do
        let(:variables) do
          {
            input: {
              rate: 100,
              chipAmount: 50,
              createdDate: "2024年12月16日",
              participantUsers: [
                { name: "プレイヤー1" },
                { name: "プレイヤー2" },
              ],
              games: [
                {
                  results: [
                    { resultPoints: 30, ranking: 1 },
                    { resultPoints: -30, ranking: 2 },
                  ],
                },
              ],
            },
          }
        end

        it "エラーが返ること" do
          json = subject

          expect(json[:data][:createMahjongSession][:mahjongSession]).to be_nil
          expect(json[:errors]).to be_present
        end
      end
    end
  end
end
