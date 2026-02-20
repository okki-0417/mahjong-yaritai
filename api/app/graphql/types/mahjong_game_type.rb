module Types
  class MahjongGameType < Types::BaseObject
    field :id, ID, null: false
    field :mahjong_session_id, ID, null: false
    field :mahjong_session, Types::MahjongSessionType, null: false
    field :mahjong_results, [ Types::MahjongResultType ], null: false
  end
end
