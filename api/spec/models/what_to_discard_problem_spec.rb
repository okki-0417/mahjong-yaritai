# frozen_string_literal: true

require "rails_helper"

RSpec.describe WhatToDiscardProblem, type: :model do
  describe "validations" do
    subject {
      described_class.new(
        round: 1,
        turn: 1,
        wind: "東",
        user: create(:user),
        dora: create(:tile),
        points: 25000,
        hand1_id:,
        hand2_id:,
        hand3_id:,
        hand4_id:,
        hand5_id:,
        hand6_id: create(:tile).id,
        hand7_id: create(:tile).id,
        hand8_id: create(:tile).id,
        hand9_id: create(:tile).id,
        hand10_id: create(:tile).id,
        hand11_id: create(:tile).id,
        hand12_id: create(:tile).id,
        hand13_id: create(:tile).id,
        tsumo_id: create(:tile).id,
      )
    }

    let(:hand1_id) { create(:tile, suit: "manzu", ordinal_number_in_suit: 1, name: "一萬").id }
    let(:hand2_id) { create(:tile, suit: "manzu", ordinal_number_in_suit: 2, name: "二萬").id }
    let(:hand3_id) { create(:tile, suit: "manzu", ordinal_number_in_suit: 3, name: "三萬").id }
    let(:hand4_id) { create(:tile, suit: "manzu", ordinal_number_in_suit: 4, name: "四萬").id }
    let(:hand5_id) { create(:tile, suit: "manzu", ordinal_number_in_suit: 5, name: "五萬").id }

    describe "#confirm_no_more_than_four_duplicated_tiles" do
      context "手牌に同じ牌が4枚以下の場合" do
        it "バリデーションが通ること" do
          is_expected.to be_valid
        end
      end

      context "手牌に同じ牌が5枚以上ある場合" do
        let(:hand2_id) { hand1_id }
        let(:hand3_id) { hand1_id }
        let(:hand4_id) { hand1_id }
        let(:hand5_id) { hand1_id }

        it "バリデーションが落ちること" do
          is_expected.to be_invalid
          expect(subject.errors).to be_added(:base, :too_many_duplicated_tiles)
        end
      end
    end

    describe "#confirm_tiles_are_sorted" do
      context "手牌が昇順にソートされている場合" do
        it "バリデーションが通ること" do
          is_expected.to be_valid
        end
      end

      context "手牌が昇順にソートされていない場合" do
        let(:hand1_id) { 10 }
        let(:hand2_id) { 5 }
        let(:hand3_id) { 15 }
        let(:hand4_id) { 8 }
        let(:hand5_id) { 20 }

        it "バリデーションが落ちること" do
          is_expected.to be_invalid
          expect(subject.errors).to be_added(:base, :tiles_not_sorted)
        end
      end
    end
  end
end
