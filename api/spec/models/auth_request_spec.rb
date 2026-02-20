# frozen_string_literal: true

require "rails_helper"

RSpec.describe AuthRequest, type: :model do
  describe "#callbacks" do
    describe "#generate_token" do
      let(:authorization) { described_class.new(email:) }
      let(:email) { "test@mahjong-yaritai.com" }

      subject { authorization.save }

      context "正常に作成された場合" do
        it "tokensが作成されていること" do
          expect(authorization.token).to eq nil
          subject
          expect(authorization.token).to be_present
        end
      end
    end
  end
end
