module Types
  class MahjongParticipantType < Types::BaseObject
    field :id, ID, null: false
    field :user_id, ID, null: true
    field :user, Types::UserType, null: true
    field :mahjong_session_id, ID, null: false
    field :mahjong_session, Types::MahjongSessionType, null: false
    field :total_points, Integer, null: false
    field :total_profits, Integer, null: false
    field :average_ranking, Float, null: false
    field :name, String, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
