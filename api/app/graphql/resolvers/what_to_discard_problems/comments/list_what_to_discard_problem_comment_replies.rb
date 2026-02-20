# frozen_string_literal: true

module Resolvers
  module WhatToDiscardProblems
    module Comments
      class ListWhatToDiscardProblemCommentReplies < BaseResolver
        type Types::CommentType.connection_type, null: false

        argument :problem_id, ID, required: true
        argument :parent_comment_id, ID, required: true

        def resolve(problem_id:, parent_comment_id:)
          commentable = WhatToDiscardProblem.find(problem_id)

          Comment
            .where(parent_comment_id:, commentable:)
            .preload(user: :avatar_attachment)
            .order(id: :asc)
        end
      end
    end
  end
end
