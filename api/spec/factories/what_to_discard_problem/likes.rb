# frozen_string_literal: true

FactoryBot.define do
  factory :like do
    association :user
    association :likable, factory: :what_to_discard_problem
  end
end
