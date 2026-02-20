module Types
  class MahjongResultType < Types::BaseObject
    field :id, ID, null: false
    field :mahjong_participant_id, ID, null: false
    field :mahjong_participant, Types::MahjongParticipantType, null: false
    field :mahjong_game_id, ID, null: false
    field :mahjong_game, Types::MahjongGameType, null: false
    field :ranking, Int, null: false
    field :score, Int
    field :result_points, Int, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
