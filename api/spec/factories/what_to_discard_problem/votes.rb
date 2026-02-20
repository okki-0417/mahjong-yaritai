# frozen_string_literal: true

FactoryBot.define do
  factory :what_to_discard_problem_vote, class: "WhatToDiscardProblem::Vote" do
    association :user
    association :what_to_discard_problem
    association(:tile, factory: :tile)
  end
end
