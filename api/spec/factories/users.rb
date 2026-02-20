# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    sequence(:name) { |n| "テストユーザー#{n}" }
    sequence(:email) { |n| "user#{SecureRandom.urlsafe_base64}@mahjong-yaritai.com" }
  end
end
