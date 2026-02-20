# frozen_string_literal: true

module Mutations
  module WhatToDiscardProblems
    class DeleteWhatToDiscardProblem < BaseMutation
      include Authenticatable

      field :id, ID, null: false

      argument :id, ID, required: true

      def resolve(id:)
        raise GraphQL::ExecutionError, "ログインしてください" unless logged_in?

        problem = context[:current_user].created_what_to_discard_problems.find(id)
        problem_id = problem.id

        if problem.destroy
          { id: problem_id }
        else
          problem.errors.full_messages.each do |message|
            context.add_error(GraphQL::ExecutionError.new(message))
          end
          nil
        end
      end
    end
  end
end
