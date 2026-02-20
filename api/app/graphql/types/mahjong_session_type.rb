# frozen_string_literal: true

module Types
  class MahjongSessionType < Types::BaseObject
    field :id, ID, null: false
    field :total_game_fee, Int, null: false
    field :name, String, null: false
    field :mahjong_scoring_setting, Types::MahjongScoringSettingType, null: false
    field :creator_user_id, ID, null: false
    field :creator_user, Types::UserType, null: false
    field :participant_users, [ Types::UserType ], null: false
    field :mahjong_participants, [ Types::MahjongParticipantType ], null: false
    field :mahjong_games, [ Types::MahjongGameType ], null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    field :my_total_points, Int, null: false
    field :my_average_ranking, Float, null: false
    field :my_total_profits, Int, null: false

    def my_total_points
      return 0 unless context[:current_user]
      return 0 unless context[:mahjong_session_scores_to_prevent_N_plus_1]
      return 0 unless context[:mahjong_session_scores_to_prevent_N_plus_1][object.id]

      context[:mahjong_session_scores_to_prevent_N_plus_1][object.id].values.sum { |data| data[:result_points] }
    end

    def my_average_ranking
      return 0.0 unless context[:current_user]
      return 0.0 unless context[:mahjong_session_scores_to_prevent_N_plus_1]
      return 0.0 unless context[:mahjong_session_scores_to_prevent_N_plus_1][object.id]

      total_games = context[:mahjong_session_scores_to_prevent_N_plus_1][object.id].values.size
      return 0.0 if total_games == 0

      total_ranking = context[:mahjong_session_scores_to_prevent_N_plus_1][object.id].values.sum { |data| data[:ranking] }
      (total_ranking.to_f / total_games).round(2)
    end

    def my_total_profits
      return 0 unless context[:current_user]
      return 0 unless context[:mahjong_session_scores_to_prevent_N_plus_1]
      return 0 unless context[:mahjong_session_scores_to_prevent_N_plus_1][object.id]

      total_points = context[:mahjong_session_scores_to_prevent_N_plus_1][object.id].values.sum { |data| data[:result_points] }
      total_points * object.mahjong_scoring_setting.rate
    end
  end
end
