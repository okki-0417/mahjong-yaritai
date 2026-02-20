# frozen_string_literal: true

FactoryBot.define do
  factory :what_to_discard_problem do
    association :user, factory: :user
    round { "東一" }
    turn  { 2 }
    wind  { "東" }
    points { 25000 }
    association(:dora, factory: :tile)
    association(:hand1, factory: :tile)
    association(:hand2, factory: :tile)
    association(:hand3, factory: :tile)
    association(:hand4, factory: :tile)
    association(:hand5, factory: :tile)
    association(:hand6, factory: :tile)
    association(:hand7, factory: :tile)
    association(:hand8, factory: :tile)
    association(:hand9, factory: :tile)
    association(:hand10, factory: :tile)
    association(:hand11, factory: :tile)
    association(:hand12, factory: :tile)
    association(:hand13, factory: :tile)
    association(:tsumo, factory: :tile)
    description do
      <<~COMMENT
        一萬の刻子があり、二三四と揃えば一気通貫も見える形。
        ただし東が対子で残っており、役牌の可能性もある。スピードを取るなら東を残し、打九萬が無難。
        一方で打東とすれば純チャンや一通の夢も見られるがリスクは増す。
        今回の問題は『守備的に打九萬を選べるか』を意図して作成しました。
      COMMENT
    end

    trait :dev do
      dora_id { 1 }
      hand1_id { 1 }
      hand2_id { 2 }
      hand3_id { 3 }
      hand4_id { 4 }
      hand5_id { 5 }
      hand6_id { 6 }
      hand7_id { 7 }
      hand8_id { 8 }
      hand9_id { 9 }
      hand10_id { 10 }
      hand11_id { 11 }
      hand12_id { 12 }
      hand13_id { 13 }
      tsumo_id { 14 }
    end
  end
end
