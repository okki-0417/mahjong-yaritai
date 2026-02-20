# frozen_string_literal: true

FactoryBot.define do
  factory :mahjong_session do
    total_game_fee { 0 }
    association :creator_user, factory: :user
    association :mahjong_scoring_setting

    trait :with_participants do
      after(:create) do |mahjong_session|
        create(:mahjong_participant, mahjong_session:, user: mahjong_session.creator_user)
        create_list(:mahjong_participant, 3, mahjong_session: mahjong_session)
      end
    end

    trait :with_games_and_results do
      after(:create) do |mahjong_session|
        if mahjong_session.mahjong_participants.empty?
          create(:mahjong_participant, mahjong_session:, user: mahjong_session.creator_user)
          create_list(:mahjong_participant, 3, mahjong_session: mahjong_session)
          mahjong_session.reload
        end

        mahjong_game = create(:mahjong_game, mahjong_session:)

        mahjong_session.mahjong_participants.each_with_index do |mahjong_participant, index|
          create(:mahjong_result,
            mahjong_participant:,
            mahjong_game:,
            score: [ 38000, 32000, 28000, 22000 ][index],
            result_points: [ 43, -25, -10, -8 ][index],
            ranking: index + 1
          )
        end
      end
    end
  end
end
