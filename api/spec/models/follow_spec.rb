# frozen_string_literal: true

require "rails_helper"

RSpec.describe Follow, type: :model do
  describe "validations" do
    subject do
      Follow.new(follower:, followee:)
    end

    let(:follower) { create(:user) }
    let(:followee) { create(:user) }

    context "自分自身をフォローしようとした場合" do
      let(:followee) { follower }

      it { is_expected.to be_invalid }
    end
  end
end
