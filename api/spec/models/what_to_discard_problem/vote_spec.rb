# frozen_string_literal: true

require "rails_helper"

RSpec.describe WhatToDiscardProblem::Vote, type: :model do
  describe "#validates" do
    let(:user) { FactoryBot.create(:user) }
    let(:user_id) { user.id }
    let(:what_to_discard_problem) { FactoryBot.create(:what_to_discard_problem) }
    let(:what_to_discard_problem_id) { what_to_discard_problem.id }
    let(:tile) { FactoryBot.create(:tile) }

    subject { described_class.new(
      user_id:,
      what_to_discard_problem_id:,
      tile_id:
    ) }

    context "" do
    end
  end
end
