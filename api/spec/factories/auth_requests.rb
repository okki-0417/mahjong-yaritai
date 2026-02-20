# frozen_string_literal: true

FactoryBot.define do
  factory :auth_request, class: 'AuthRequest' do
    sequence(:email) { |n| "test#{n}@mahjong-yaritai.com" }

    trait :expired do
      after(:create) do |auth_request|
        auth_request.update_column(:expired_at, 1.hour.ago)
      end
    end
  end
end
