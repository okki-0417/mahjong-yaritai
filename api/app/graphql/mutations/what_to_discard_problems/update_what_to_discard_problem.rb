# frozen_string_literal: true

module Mutations
  module WhatToDiscardProblems
    class UpdateWhatToDiscardProblem < BaseMutation
      include Authenticatable

      field :what_to_discard_problem, Types::WhatToDiscardProblemType, null: false

      argument :id, ID, required: true
      argument :description, String, required: false
      argument :round, String, required: false
      argument :turn, Integer, required: false
      argument :wind, String, required: false
      argument :points, Integer, required: false
      argument :dora_id, ID, required: false
      argument :hand1_id, ID, required: false
      argument :hand2_id, ID, required: false
      argument :hand3_id, ID, required: false
      argument :hand4_id, ID, required: false
      argument :hand5_id, ID, required: false
      argument :hand6_id, ID, required: false
      argument :hand7_id, ID, required: false
      argument :hand8_id, ID, required: false
      argument :hand9_id, ID, required: false
      argument :hand10_id, ID, required: false
      argument :hand11_id, ID, required: false
      argument :hand12_id, ID, required: false
      argument :hand13_id, ID, required: false
      argument :tsumo_id, ID, required: false

      def resolve(id:, **attributes)
        require_authentication!

        problem = current_user.created_what_to_discard_problems.find(id)

        if problem.update(attributes)
          { what_to_discard_problem: problem }
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
