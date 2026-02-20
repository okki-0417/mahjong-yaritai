# frozen_string_literal: true

require "rails_helper"

RSpec.describe MahjongParticipant, type: :model do
  describe "アソシエーション" do
    it "belongs_to 麻雀セッション" do
      should belong_to(:mahjong_session)
    end

    it "belongs_to ユーザー (optional)" do
      should belong_to(:user).optional
    end

    it "has_many 麻雀結果" do
      should have_many(:mahjong_results).dependent(:destroy)
    end

    it "has_many 麻雀ゲーム through 麻雀結果" do
      should have_many(:mahjong_games).through(:mahjong_results)
    end
  end

  describe "バリデーション" do
    subject { build(:mahjong_participant, mahjong_session:, user:, name:) }

    let(:mahjong_session) { create(:mahjong_session) }
    let(:user) { create(:user) }
    let(:name) { "プレイヤー1" }

    describe "name" do
      context "名前が空の場合" do
        let(:name) { "" }

        it "バリデーションエラーになること" do
          expect(subject).not_to be_valid
          expect(subject.errors[:name]).to include("を入力してください")
        end
      end
    end

    describe "user_id" do
      context "同じセッション内で同じユーザーが重複する場合" do
        before { create(:mahjong_participant, mahjong_session:, user:, name: "重複したユーザー")  }

        it "バリデーションエラーになること" do
          expect(subject).not_to be_valid
          expect(subject.errors[:user_id]).to include("はすでにこのセッションに参加しています")
        end
      end

      context "ユーザーが存在しない場合" do
        let(:user) { nil }

        it "作成できること" do
          expect(subject).to be_valid
        end
      end
    end
  end

  describe "コールバック" do
    describe "after_initialize" do
      subject { described_class.new(user:) }

      context "ユーザーが与えられている場合" do
        let(:user) { create(:user, name: "ユーザー名") }
        it "名前がユーザー名で設定されること" do
          expect(subject.name).to eq("ユーザー名")
        end
      end

      context "ユーザーが与えられていない場合" do
        let(:user) { nil }

        it "名前がデフォルト名で設定されること" do
          expect(subject.name).to eq(MahjongParticipant::DEFAULT_NAME)
        end
      end
    end
  end

  describe "メソッド" do
    describe "#winner_games" do
      let(:mahjong_session) { create(:mahjong_session) }
      let(:mahjong_participant) { create(:mahjong_participant, mahjong_session:) }

      context "1位になったゲームが存在する場合" do
        let(:mahjong_game_1) { create(:mahjong_game, mahjong_session:) }
        let(:mahjong_game_2) { create(:mahjong_game, mahjong_session:) }

        before do
          create(:mahjong_result, mahjong_participant:, mahjong_game: mahjong_game_1, ranking: 1)
          create(:mahjong_result, mahjong_participant:, mahjong_game: mahjong_game_2, ranking: 2)
        end

        it "1位になったゲームを返すこと" do
          winner_games = mahjong_participant.winner_games
          expect(winner_games).to include(mahjong_game_1)
          expect(winner_games).not_to include(mahjong_game_2)
        end
      end

      context "1位になったゲームが存在しない場合" do
        it "空の配列を返すこと" do
          winner_games = mahjong_participant.winner_games
          expect(winner_games).to be_empty
        end
      end
    end
  end
end
