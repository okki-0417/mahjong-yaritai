# frozen_string_literal: true

require "rails_helper"

RSpec.describe Like, type: :model do
  describe "#validates" do
    subject do
      described_class.new(
        user_id: user.id,
        likable_type: likable.class.name,
        likable_id: likable.id
      )
    end

    let(:user) { create(:user) }
    let(:likable) { create(:what_to_discard_problem) }


    context "同じユーザーが重複して作成した場合" do
      let!(:like) { create(:like, user:, likable:) }

      it_behaves_like :invalid

      it "エラーが追加されていること" do
        subject.valid?
        expect(subject.errors).to be_added(:user_id, :taken, value: user.id)
      end
    end
  end
end
