# frozen_string_literal: true

module Mutations
  module WhatToDiscardProblems
    module Comments
      class DeleteWhatToDiscardProblemComment < BaseMutation
        include Authenticatable

        field :id, ID, null: false

        argument :comment_id, ID, required: true

        def resolve(comment_id:)
          require_authentication!

          comment = current_user.created_comments.find(comment_id)
          comment_id_value = comment.id

          if comment.destroy
            { id: comment_id_value }
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
