# frozen_string_literal: true

require "rails_helper"

RSpec.describe MahjongScoringSetting, type: :model do
  describe "attributes" do
    subject { build(:mahjong_scoring_setting, params) }
    let(:params) { {} }

    describe "rate" do
      context "指定しない場合" do
        it "デフォルト値が設定されていること" do
          expect(subject.rate).to eq 100
        end
      end
    end

    describe "chip_amount" do
      context "指定しない場合" do
        it "デフォルト値が設定されていること" do
          expect(subject.chip_amount).to eq 0
        end
      end
    end
  end

  describe "バリデーション" do
    subject { build(:mahjong_scoring_setting, rate:, chip_amount:) }

    let(:rate) { 100 }
    let(:chip_amount) { 0 }

    describe "rate" do
      it "整数のみ許可されていること" do
        should validate_numericality_of(:rate).only_integer
      end

      context "0以下の値の場合" do
        let(:rate) { 0 }

        it "バリデーションエラーになること" do
          expect(subject).not_to be_valid
          expect(subject.errors[:rate]).to include("は0より大きい値にしてください")
        end
      end
    end

    describe "chip_amount" do
      it "整数のみ許可されていること" do
        should validate_numericality_of(:chip_amount).only_integer
      end

      context "0未満の値の場合" do
        let(:chip_amount) { -1 }

        it "バリデーションエラーになること" do
          expect(subject).not_to be_valid
          expect(subject.errors[:chip_amount]).to include("は0以上の値にしてください")
        end
      end
    end
  end
end
