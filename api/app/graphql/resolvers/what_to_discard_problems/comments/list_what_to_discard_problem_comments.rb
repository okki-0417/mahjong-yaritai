# frozen_string_literal: true

module Resolvers
  module WhatToDiscardProblems
    module Comments
      class ListWhatToDiscardProblemComments < BaseResolver
        type Types::CommentType.connection_type, null: false

        argument :what_to_discard_problem_id, ID, required: true

        def resolve(what_to_discard_problem_id:)
          Comment
            .parents
            .where(commentable_type: "WhatToDiscardProblem", commentable_id: what_to_discard_problem_id)
            .preload(user: :avatar_attachment)
            .order(id: :desc)
        end
      end
    end
  end
end
