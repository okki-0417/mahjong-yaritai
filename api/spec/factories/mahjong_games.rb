# frozen_string_literal: true

FactoryBot.define do
  factory :mahjong_game do
    association :mahjong_session
  end
end
