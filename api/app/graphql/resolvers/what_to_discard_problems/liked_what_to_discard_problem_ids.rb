module Resolvers
  module WhatToDiscardProblems
    class LikedWhatToDiscardProblemIds < BaseResolver
      include Authenticatable
      type [ ID ], null: false
      argument :what_to_discard_problem_ids, [ ID ], required: true

      def resolve(what_to_discard_problem_ids:)
        return [] unless logged_in?

        current_user
          .liked_what_to_discard_problems
          .where(id: what_to_discard_problem_ids)
          .pluck(:id)
      end
    end
  end
end
