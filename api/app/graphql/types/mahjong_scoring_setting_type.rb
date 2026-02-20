module Types
  class MahjongScoringSettingType < Types::BaseObject
    field :id, ID, null: false
    field :rate, Int, null: false
    field :chip_amount, Int, null: false
    field :uma_rule_label, String, null: false
    field :oka_rule_label, String, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
