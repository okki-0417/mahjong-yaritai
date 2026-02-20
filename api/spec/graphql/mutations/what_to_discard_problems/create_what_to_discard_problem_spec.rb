# frozen_string_literal: true

require "rails_helper"

RSpec.describe Mutations::WhatToDiscardProblems::CreateWhatToDiscardProblem, type: :request do
  include GraphqlHelper

  describe "resolve" do
    subject do
      execute_mutation(mutation, variables, context: { current_user: })
      JSON.parse(response.body, symbolize_names: true)
    end

    let(:current_user) { create(:user) }
    let(:tiles) { create_list(:tile, 15) }
    let(:variables) do
      {
        doraId: tiles[0].id.to_s,
        hand1Id: tiles[1].id.to_s,
        hand2Id: tiles[2].id.to_s,
        hand3Id: tiles[3].id.to_s,
        hand4Id: tiles[4].id.to_s,
        hand5Id: tiles[5].id.to_s,
        hand6Id: tiles[6].id.to_s,
        hand7Id: tiles[7].id.to_s,
        hand8Id: tiles[8].id.to_s,
        hand9Id: tiles[9].id.to_s,
        hand10Id: tiles[10].id.to_s,
        hand11Id: tiles[11].id.to_s,
        hand12Id: tiles[12].id.to_s,
        hand13Id: tiles[13].id.to_s,
        tsumoId: tiles[14].id.to_s,
        description: "テスト問題",
      }
    end
    let(:mutation) do
      <<~GQL
        mutation(
          $doraId: ID!
          $hand1Id: ID!
          $hand2Id: ID!
          $hand3Id: ID!
          $hand4Id: ID!
          $hand5Id: ID!
          $hand6Id: ID!
          $hand7Id: ID!
          $hand8Id: ID!
          $hand9Id: ID!
          $hand10Id: ID!
          $hand11Id: ID!
          $hand12Id: ID!
          $hand13Id: ID!
          $tsumoId: ID!
          $description: String
        ) {
          createWhatToDiscardProblem(input: {
            doraId: $doraId
            hand1Id: $hand1Id
            hand2Id: $hand2Id
            hand3Id: $hand3Id
            hand4Id: $hand4Id
            hand5Id: $hand5Id
            hand6Id: $hand6Id
            hand7Id: $hand7Id
            hand8Id: $hand8Id
            hand9Id: $hand9Id
            hand10Id: $hand10Id
            hand11Id: $hand11Id
            hand12Id: $hand12Id
            hand13Id: $hand13Id
            tsumoId: $tsumoId
            description: $description
          }) {
            whatToDiscardProblem {
              id
              description
              user {
                id
                name
                avatarUrl
              }
            }
          }
        }
      GQL
    end

    context "ログインしていない場合" do
      let(:current_user) { nil }

      it "エラーが返ること" do
        json = subject

        expect(json[:data][:createWhatToDiscardProblem]).to be_nil
        expect(json[:errors].any?).to be true
      end
    end

    context "ログインしている場合" do
      context "保存に失敗した場合" do
        before do
          errors = double(full_messages: [ "バリデーションエラー" ])
          problem = instance_double(WhatToDiscardProblem, save: false, errors:)
          allow(current_user.created_what_to_discard_problems).to receive(:new).and_return(problem)
        end

        it "バリデーションエラーが返ること" do
          json = subject

          expect(json[:data][:createWhatToDiscardProblem]).to be_nil
          expect(json[:errors].any?).to be true
        end
      end

      context "保存に成功した場合" do
        it "問題が作成できること" do
          json = subject

          expect(json[:data][:createWhatToDiscardProblem][:whatToDiscardProblem]).to be_present
        end
      end
    end
  end
end
