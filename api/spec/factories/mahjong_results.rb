# frozen_string_literal: true

FactoryBot.define do
  factory :mahjong_result do
    association :mahjong_participant
    association :mahjong_game
    sequence(:ranking) { |n| ((n - 1) % 4) + 1 }
    score { 30000 }
    result_points { 50 }
  end
end
