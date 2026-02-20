# frozen_string_literal: true

require "rails_helper"

RSpec.describe User, type: :model do
  describe "#created_resources_summary" do
    subject { user.created_resources_summary }
    let(:user) { create(:user) }

    context "何切る問題を作成していた場合" do
      before do
        create_list(:what_to_discard_problem, 3, user:)
      end

      it "何切る問題の数を返す" do
        expect(subject[:what_to_discard_problems_count]).to eq 3
      end
    end
  end

  describe "#delete_account" do
    subject { user.delete_account }

    let!(:user) { create(:user) }

    context "成功した場合" do
      it "アカウントが削除されていること" do
        expect { subject }.to change { User.count }.by(-1)
      end

      it "trueを返すこと" do
        is_expected.to be true
      end
    end

    context "トランザクション内でエラーが発生した場合" do
      before do
        allow(user.created_what_to_discard_problems).to receive(:destroy_all).and_raise(ActiveRecord::RecordNotDestroyed)
      end

      it "アカウントが削除されていないこと" do
        expect { subject }.not_to change { User.count }
      end

      it "falseを返すこと" do
        is_expected.to be false
      end

      it "errorsにエラーメッセージが追加されていること" do
        subject
        expect(user.errors[:base]).to be_present
      end
    end
  end
end
