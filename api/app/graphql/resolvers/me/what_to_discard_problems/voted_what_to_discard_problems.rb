module Resolvers
  module Me
    module WhatToDiscardProblems
      class VotedWhatToDiscardProblems < BaseResolver
        include Authenticatable

        type Types::WhatToDiscardProblemType.connection_type, null: false

        def resolve
          return WhatToDiscardProblem.none unless logged_in?

          problems = current_user
                     .voted_what_to_discard_problems
                     .preload(user: :avatar_attachment)
                     .order(id: :desc)

          context[:liked_problem_ids] = current_user.liked_what_to_discard_problems.pluck(:id)
          context[:vote_tile_ids] = current_user
                                    .created_what_to_discard_problem_votes
                                    .where(what_to_discard_problem_id: problems.map(&:id))
                                    .pluck(:what_to_discard_problem_id, :tile_id)
                                    .to_h

          problems
        end
      end
    end
  end
end
