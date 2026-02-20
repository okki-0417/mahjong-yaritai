# frozen_string_literal: true

require "rails_helper"

RSpec.describe MahjongResult, type: :model do
  describe "アソシエーション" do
    it "belongs_to 麻雀参加者" do
      should belong_to(:mahjong_participant)
    end

    it "belongs_to 麻雀ゲーム" do
      should belong_to(:mahjong_game)
    end
  end

  describe "バリデーション" do
    subject { build(:mahjong_result, mahjong_participant:, mahjong_game:, result_points:, score:) }

    let(:mahjong_game) { create(:mahjong_game, mahjong_session:) }
    let(:mahjong_session) { create(:mahjong_session) }
    let(:mahjong_participant) { create(:mahjong_participant, mahjong_session:) }
    let(:result_points) { 0 }
    let(:score) { 25000 }

    describe "score" do
      it "整数のみ許可されていること" do
        should validate_numericality_of(:score).only_integer
      end

      it "必須ではないこと" do
        should allow_value(nil).for(:score)
      end
    end

    describe "result_points" do
      it "数値のみ許可されていること" do
        should validate_numericality_of(:result_points)
      end

      context "正の値の場合" do
        let(:result_points) { 15 }

        it "有効であること" do
          expect(subject).to be_valid
        end
      end

      context "負の値の場合" do
        let(:result_points) { -10 }

        it "有効であること" do
          expect(subject).to be_valid
        end
      end
    end

    describe "mahjong_participant_id" do
      context "同じゲームで参加者の結果が重複した場合" do
        before { create(:mahjong_result, mahjong_participant:, mahjong_game:) }

        it "バリデーションエラーになること" do
          expect(subject).not_to be_valid
          expect(subject.errors[:mahjong_participant_id]).to include("はすでにこのゲームに結果が登録されています")
        end
      end
    end

    describe "ranking" do
      it "必須であること" do
        should validate_presence_of(:ranking)
      end

      it "1から4の整数のみ許可されていること" do
        should validate_numericality_of(:ranking).only_integer.is_greater_than(0).is_less_than_or_equal_to(4)
      end
    end
  end
end
