# frozen_string_literal: true

module Resolvers
  module WhatToDiscardProblems
    module VoteResults
      class ListWhatToDiscardProblemVoteResults < BaseResolver
        type [ Types::WhatToDiscardProblemVoteResultType ], null: false

        argument :what_to_discard_problem_id, ID, required: true

        def resolve(what_to_discard_problem_id:)
          problem = WhatToDiscardProblem.find(what_to_discard_problem_id)

          votable_tile_ids = problem.hand_ids.uniq

          vote_counts = problem.votes.group(:tile_id).count
          total_votes = vote_counts.values.sum

          votable_tile_ids.map do |tile_id|
            count = vote_counts[tile_id] || 0
            percentage = total_votes > 0 ? (count.to_f / total_votes * 100).round(1) : 0.0

            { tile_id:, count:, percentage: }
          end
        end
      end
    end
  end
end
