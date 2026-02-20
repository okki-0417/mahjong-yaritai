# frozen_string_literal: true

module Resolvers
  module Me
    class ParticipatedMahjongSessions < BaseResolver
      include Authenticatable

      type Types::MahjongSessionType.connection_type, null: false

      def resolve
        require_authentication!

        # 参加したセッション OR 作成したセッション
        participated_session_ids = MahjongParticipant.where(user_id: current_user.id).select(:mahjong_session_id)
        participated_mahjong_sessions = MahjongSession
                                        .where(creator_user: current_user)
                                        .or(MahjongSession.where(id: participated_session_ids))
                                        .distinct
                                        .preload(
                                            :participant_users,
                                            :creator_user,
                                            :mahjong_scoring_setting,
                                            mahjong_participants: :mahjong_results,
                                          )

        # 例:
        # {
        #   1 => { # mahjong_session_id
        #     1 => { score: 25000, result_points: 15, ranking: 1 }, # mahjong_game_id
        #     2 => { score: 30000, result_points: 25, ranking: 2 },
        #     3 => { score: 15000, result_points: -20, ranking: 4 },
        #   },
        #   2 => {
        #     3 => { score: 20000, result_points: -10, ranking: 3 },
        #     4 => { score: 40000, result_points: 35, ranking: 1 },
        #   },
        # }
        context[:mahjong_session_scores_to_prevent_N_plus_1] = participated_mahjong_sessions.each_with_object({}) do |session, hash|
          current_user_participant = session.mahjong_participants.find { |p| p.user_id == current_user.id }
          next unless current_user_participant

          current_user_scores = current_user_participant.mahjong_results.each_with_object({}) do |result, scores_hash|
            scores_hash[result.mahjong_game_id] = {
              score: result.score,
              result_points: result.result_points,
              ranking: result.ranking,
            }
          end

          hash[session.id] = current_user_scores
        end

        participated_mahjong_sessions
      end
    end
  end
end
