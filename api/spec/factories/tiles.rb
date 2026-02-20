# frozen_string_literal: true

FactoryBot.define do
  factory :tile do
    sequence(:suit) { |n| n % 3 }
    sequence(:ordinal_number_in_suit) { |n| n % 9 + 1 }
    name { "テスト" }
  end
end
