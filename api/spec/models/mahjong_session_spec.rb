# frozen_string_literal: true

require "rails_helper"

RSpec.describe MahjongSession, type: :model do
  describe "attribute" do
    subject { described_class.new }

    describe "name" do
      it "デフォルト値が作成時の日付をフォーマットした文字列であること" do
        expected_name = Time.current.strftime("%Y年%m月%d日")
        expect(subject.name).to eq expected_name
      end
    end
  end

  describe "アソシエーション" do
    it "belongs_to 作成者ユーザー" do
      should belong_to(:creator_user).class_name("User")
    end

    it "belongs_to 麻雀スコア設定" do
      should belong_to(:mahjong_scoring_setting)
    end

    it "has_many 麻雀ゲーム" do
      should have_many(:mahjong_games).dependent(:destroy)
    end

    it "has_many 麻雀参加者" do
      should have_many(:mahjong_participants).dependent(:destroy)
    end

    it "has_many 参加者 through 麻雀参加者" do
      should have_many(:participant_users).through(:mahjong_participants).source(:user)
    end
  end

  describe "delegation" do
    let(:mahjong_session) { create(:mahjong_session, mahjong_scoring_setting:) }

    let(:mahjong_scoring_setting) { create(:mahjong_scoring_setting, rate:, chip_amount:, uma_rule_label:, oka_rule_label:) }
    let(:rate) { 100 }
    let(:chip_amount) { 50 }
    let(:uma_rule_label) { "10-30" }
    let(:oka_rule_label) { "25000点30000点返し" }

    it "rateがスコア設定から取得できること" do
      expect(mahjong_session.rate).to eq rate
    end

    it "chip_amountがスコア設定から取得できること" do
      expect(mahjong_session.chip_amount).to eq chip_amount
    end

    it "uma_rule_labelがスコア設定から取得できること" do
      expect(mahjong_session.uma_rule_label).to eq uma_rule_label
    end

    it "oka_rule_labelがスコア設定から取得できること" do
      expect(mahjong_session.oka_rule_label).to eq oka_rule_label
    end
  end
end
