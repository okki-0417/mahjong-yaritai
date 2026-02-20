# frozen_string_literal: true

module Mutations
  module WhatToDiscardProblems
    module Votes
      class DeleteWhatToDiscardProblemVote < BaseMutation
        include Authenticatable

        field :id, ID, null: false

        argument :what_to_discard_problem_id, ID, required: true

        def resolve(what_to_discard_problem_id:)
          raise GraphQL::ExecutionError, "ログインしてください" unless logged_in?

          problem = WhatToDiscardProblem.find(what_to_discard_problem_id)
          vote = context[:current_user].created_what_to_discard_problem_votes.find_by!(what_to_discard_problem: problem)
          vote_id = vote.id

          if vote.destroy
            { id: vote_id }
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
