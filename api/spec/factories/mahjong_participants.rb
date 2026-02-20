# frozen_string_literal: true

FactoryBot.define do
  factory :mahjong_participant do
    association :mahjong_session
    association :user

    # after_initializeコールバックと同じロジックをFactoryで実装
    name { user&.name || MahjongParticipant::DEFAULT_NAME }
  end
end
