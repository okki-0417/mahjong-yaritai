# frozen_string_literal: true

module Resolvers
  module WhatToDiscardProblems
    class ShowWhatToDiscardProblem < BaseResolver
      type Types::WhatToDiscardProblemType, null: true

      argument :id, ID, required: true

      def resolve(id:)
        WhatToDiscardProblem.find(id)
      end
    end
  end
end
