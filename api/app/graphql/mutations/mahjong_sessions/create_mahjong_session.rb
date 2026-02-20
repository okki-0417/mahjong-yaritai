# frozen_string_literal: true

module Mutations
  module MahjongSessions
    class CreateMahjongSession < BaseMutation
      include Authenticatable

      class ParticipantUserInput < Types::BaseInputObject
        argument :user_id, ID, required: false
        argument :name, String, required: true
        argument :avatar_url, String, required: false
      end

      class GameResultInput < Types::BaseInputObject
        argument :result_points, Integer, required: true
        argument :ranking, Integer, required: true
      end

      class GameInput < Types::BaseInputObject
        argument :results, [ GameResultInput ], required: true
      end

      field :mahjong_session, Types::MahjongSessionType, null: true

      argument :rate, Integer, required: true
      argument :chip_amount, Integer, required: true
      argument :created_date, String, required: true
      argument :participant_users, [ ParticipantUserInput ], required: true
      argument :games, [ GameInput ], required: true

      def resolve(rate:, chip_amount:, created_date:, participant_users:, games:)
        require_authentication!

        form = MahjongSessionForm.new(
          creator_user: current_user,
          name: created_date,
          rate:,
          chip_amount:,
          participant_users: participant_users.map do |pu|
            { user_id: pu.user_id, name: pu.name }
          end,
          games: games.map do |game_input|
            {
              results: game_input.results.map do |result_input|
                { result_points: result_input.result_points, ranking: result_input.ranking }
              end,
            }
          end
        )

        if form.save
          { mahjong_session: form.mahjong_session }
        else
          form.errors.each do |error|
            context.add_error(GraphQL::ExecutionError.new(error.full_message))
          end
          { mahjong_session: nil }
        end
      end
    end
  end
end
