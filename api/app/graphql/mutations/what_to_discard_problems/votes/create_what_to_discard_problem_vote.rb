# frozen_string_literal: true

module Mutations
  module WhatToDiscardProblems
    module Votes
      class CreateWhatToDiscardProblemVote < BaseMutation
        include Authenticatable

        field :vote, Types::WhatToDiscardProblemVoteType, null: false

        argument :problem_id, ID, required: true
        argument :tile_id, ID, required: true

        def resolve(problem_id:, tile_id:)
          raise GraphQL::ExecutionError, "ログインしてください" unless logged_in?

          problem = WhatToDiscardProblem.find(problem_id)

          previous_vote = context[:current_user]
                          .created_what_to_discard_problem_votes
                          .find_by(what_to_discard_problem: problem)

          previous_vote.destroy if previous_vote

          vote = context[:current_user]
                 .created_what_to_discard_problem_votes
                 .new(
              what_to_discard_problem: problem,
              tile_id:,
            )

          if vote.save
            { vote: }
          else
            vote.errors.full_messages.each do |message|
              context.add_error(GraphQL::ExecutionError.new(message))
            end
            nil
          end
        end
      end
    end
  end
end
