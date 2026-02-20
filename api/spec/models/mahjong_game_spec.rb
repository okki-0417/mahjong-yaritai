# frozen_string_literal: true

require "rails_helper"

RSpec.describe MahjongGame, type: :model do
  describe "アソシエーション" do
    it "belongs_to 麻雀セッション" do
      should belong_to(:mahjong_session)
    end
    it "has_many 麻雀結果" do
      should have_many(:mahjong_results).dependent(:destroy)
    end
    it "has_many 麻雀参加者 through 麻雀結果" do
      should have_many(:mahjong_participants).through(:mahjong_results)
    end
  end

  describe "メソッド" do
    describe "#winner" do
      subject { mahjong_game.winner }

      let(:mahjong_game) { create(:mahjong_game, mahjong_session:) }
      let(:mahjong_session) { create(:mahjong_session) }

      context "1位の結果が存在する場合" do
        let(:participant1) { create(:mahjong_participant, mahjong_session:) }
        let(:participant2) { create(:mahjong_participant, mahjong_session:) }
        let(:participant3) { create(:mahjong_participant, mahjong_session:) }
        let(:participant4) { create(:mahjong_participant, mahjong_session:) }

        before do
          create(:mahjong_result, mahjong_participant: participant1, mahjong_game:, ranking: 1)
          create(:mahjong_result, mahjong_participant: participant2, mahjong_game:, ranking: 2)
          create(:mahjong_result, mahjong_participant: participant3, mahjong_game:, ranking: 3)
          create(:mahjong_result, mahjong_participant: participant4, mahjong_game:, ranking: 4)
        end

        it "1位の参加者を返すこと" do
          expect(subject).to eq participant1
        end
      end

      context "1位の結果が存在しない場合" do
        it "nilを返すこと" do
          expect(subject).to be_nil
        end
      end
    end
  end
end
