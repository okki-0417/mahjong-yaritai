# frozen_string_literal: true

module Resolvers
  module WhatToDiscardProblems
    class ListWhatToDiscardProblems < BaseResolver
      include Authenticatable
      type Types::WhatToDiscardProblemType.connection_type, null: false

      def resolve
        problems = WhatToDiscardProblem
                   .preload(user: :avatar_attachment)
                   .order(id: :desc)

        if logged_in?
          context[:liked_problem_ids] = current_user.created_likes
                                                    .where(likable: problems)
                                                    .pluck(:likable_id)

          context[:vote_tile_ids] = current_user.created_what_to_discard_problem_votes
                                                .where(what_to_discard_problem_id: problems)
                                                .pluck(:what_to_discard_problem_id, :tile_id)
                                                .to_h
        end

        problems
      end
    end
  end
end
