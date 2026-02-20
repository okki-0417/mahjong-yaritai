# frozen_string_literal: true

require "rails_helper"

RSpec.describe MahjongSessionForm, type: :model do
  describe "バリデーション" do
    subject { form.valid? }

    let(:form) do
      described_class.new(
        creator_user:,
        name:,
        rate:,
        chip_amount:,
        participant_users:,
        games:,
      )
    end
    let(:creator_user) { create(:user) }
    let(:name) { "2024年12月16日" }
    let(:rate) { 100 }
    let(:chip_amount) { 50 }
    let(:participant_users) do
      [
        { name: "プレイヤー1" },
        { name: "プレイヤー2" },
        { name: "プレイヤー3" },
      ]
    end
    let(:games) do
      [
        { results: [
            { result_points: 30, ranking: 1 },
            { result_points: 10, ranking: 2 },
            { result_points: -40, ranking: 3 },
          ] },
      ]
    end

    describe "creator_user" do
      context "nilの場合" do
        let(:creator_user) { nil }

        it "バリデーションに通らないこと" do
          expect(subject).to be false
          expect(form.errors).to be_added(:creator_user, :blank)
        end
      end

      context "ユーザーが存在する場合" do
        it "バリデーションに通ること" do
          expect(subject).to be true
          expect(form.errors[:creator_user]).to be_empty
        end
      end
    end

    describe "name" do
      context "空文字の場合" do
        let(:name) { "" }

        it "バリデーションに通らないこと" do
          expect(subject).to be false
          expect(form.errors).to be_added(:name, :blank)
        end
      end

      context "値がある場合" do
        it "バリデーションに通ること" do
          expect(subject).to be true
          expect(form.errors[:name]).to be_empty
        end
      end
    end

    describe "rate" do
      context "nilの場合" do
        let(:rate) { nil }

        it "バリデーションに通らないこと" do
          expect(subject).to be false
          expect(form.errors).to be_added(:rate, :blank)
        end
      end

      context "整数の場合" do
        it "バリデーションに通ること" do
          expect(subject).to be true
          expect(form.errors[:rate]).to be_empty
        end
      end
    end

    describe "chip_amount" do
      context "nilの場合" do
        let(:chip_amount) { nil }

        it "バリデーションに通らないこと" do
          expect(subject).to be false
          expect(form.errors).to be_added(:chip_amount, :blank)
        end
      end

      context "負の値の場合" do
        let(:chip_amount) { -10 }

        it "バリデーションに通らないこと" do
          expect(subject).to be false
          expect(form.errors).to be_added(:chip_amount, :greater_than_or_equal_to, value: -10, count: 0)
        end
      end

      context "0以上の場合" do
        let(:chip_amount) { 0 }

        it "バリデーションに通ること" do
          expect(subject).to be true
          expect(form.errors[:chip_amount]).to be_empty
        end
      end
    end

    describe "participant_users" do
      context "3人未満の場合" do
        let(:participant_users) do
          [
            { name: "プレイヤー1" },
            { name: "プレイヤー2" },
          ]
        end

        it "バリデーションに通らないこと" do
          expect(subject).to be false
          expect(form.errors).to be_added(:participant_users, "は最低3人以上必要です")
        end
      end

      context "3人以上の場合" do
        it "バリデーションに通ること" do
          expect(subject).to be true
          expect(form.errors[:participant_users]).to be_empty
        end
      end
    end

    describe "games" do
      context "1ゲーム未満の場合" do
        let(:games) { [] }

        it "バリデーションに通らないこと" do
          expect(subject).to be false
          expect(form.errors).to be_added(:games, "は最低1つ以上必要です")
        end
      end

      context "1ゲーム以上の場合" do
        it "バリデーションに通ること" do
          expect(subject).to be true
          expect(form.errors[:games]).to be_empty
        end
      end
    end

    describe "game_results" do
      context "ゲームの結果が3人未満の場合" do
        let(:games) { [{ results: [{ result_points: 30, ranking: 1 }] }] }

        it "バリデーションに通らないこと" do
          expect(subject).to be false
          expect(form.errors).to be_added(:base, "1戦目の結果をすべて入力してください")
        end
      end

      context "ゲームの結果が3人以上の場合" do
        it "バリデーションに通ること" do
          expect(subject).to be true
          expect(form.errors[:games]).to be_empty
        end
      end
    end
  end

  describe "#save" do
    subject { form.save }

    let(:creator_user) { create(:user) }
    let(:form) do
      described_class.new(
        creator_user:,
        name: "2024年12月16日",
        rate: 100,
        chip_amount: 50,
        participant_users: [
          { name: "プレイヤー1", user_id: create(:user).id },
          { name: "プレイヤー2" },
          { name: "プレイヤー3" },
        ],
        games: [
          { results: [
              { result_points: 30, ranking: 1 },
              { result_points: 10, ranking: 2 },
              { result_points: -40, ranking: 3 },
            ] },
        ],
      )
    end

    context "バリデーションが通る場合" do
      it "trueを返すこと" do
        expect(subject).to be true
      end

      it "MahjongScoringSettingが正しく作成されること" do
        expect { subject }.to change(MahjongScoringSetting, :count).by(1)

        expect(form.mahjong_session.rate).to eq(100)
        expect(form.mahjong_session.chip_amount).to eq(50)
      end

      it "MahjongSessionが正しく作成されること" do
        expect { subject }.to change(MahjongSession, :count).by(1)

        expect(form.mahjong_session).to be_a(MahjongSession)
        expect(form.mahjong_session.name).to eq("2024年12月16日")
      end

      it "MahjongParticipantが正しく作成されること" do
        expect { subject }.to change(MahjongParticipant, :count).by(3)

        participants = form.mahjong_session.mahjong_participants
        expect(participants.map(&:name)).to contain_exactly("プレイヤー1", "プレイヤー2", "プレイヤー3")

        participant_without_user = participants.find_by(name: "プレイヤー3")
        expect(participant_without_user.user_id).to be_nil
      end

      it "MahjongGameが正しく作成されること" do
        expect { subject }.to change(MahjongGame, :count).by(1)
      end

      it "MahjongResultが正しく作成されること" do
        expect { subject }.to change(MahjongResult, :count).by(3)

        game = form.mahjong_session.mahjong_games.first
        results = game.mahjong_results
        expect(results.map(&:result_points)).to contain_exactly(30, 10, -40)
        expect(results.map(&:ranking)).to contain_exactly(1, 2, 3)
      end
    end

    context "バリデーションが通らない場合" do
      let(:creator_user) { nil }

      it "falseを返すこと" do
        expect(subject).to be false
      end

      it "すべてのレコードが一つも作成されないこと" do
        expect { subject }
          .to not_change { MahjongScoringSetting.count }
          .and not_change { MahjongSession.count }
          .and not_change { MahjongParticipant.count }
          .and not_change { MahjongGame.count }
          .and not_change { MahjongResult.count }
      end
    end
  end
end
