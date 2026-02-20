# frozen_string_literal: true

module Mutations
  module WhatToDiscardProblems
    module Comments
      class CreateWhatToDiscardProblemComment < BaseMutation
        include Authenticatable

        argument :what_to_discard_problem_id, ID, required: true
        argument :content, String, required: true
        argument :parent_comment_id, ID, required: false

        field :comment, Types::CommentType, null: false

        def resolve(what_to_discard_problem_id:, content:, parent_comment_id: nil)
          require_authentication!

          comment = current_user.created_comments.new(
            commentable_type: WhatToDiscardProblem.name,
            commentable_id: what_to_discard_problem_id,
            content:,
            parent_comment_id:,
          )

          if comment.save
            { comment: }
          else
            comment.errors.full_messages.each do |message|
              context.add_error(GraphQL::ExecutionError.new(message))
            end
            nil
          end
        end
      end
    end
  end
end
