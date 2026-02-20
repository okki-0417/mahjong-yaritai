FactoryBot.define do
  factory :learning_question do
    association :category, factory: :learning_category
    statement { "麻雀で使用される牌の総数は何枚ですか？" }
    answer { "136枚（34種類×4枚）" }
  end
end
