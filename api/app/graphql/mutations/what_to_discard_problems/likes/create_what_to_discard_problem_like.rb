# frozen_string_literal: true

module Mutations
  module WhatToDiscardProblems
    module Likes
      class CreateWhatToDiscardProblemLike < BaseMutation
        include Authenticatable

        field :like, Types::LikeType, null: false

        argument :problem_id, ID, required: true

        def resolve(problem_id:)
          require_authentication!

          problem = WhatToDiscardProblem.find(problem_id)

          like = current_user.created_likes.new(likable: problem)

          if like.save
            { like: }
          else
            like.errors.full_messages.each do |message|
              context.add_error(GraphQL::ExecutionError.new(message))
            end
            nil
          end
        end
      end
    end
  end
end
