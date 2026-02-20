module Resolvers
  module WhatToDiscardProblems
    class VotedTileIds < BaseResolver
      include Authenticatable

      VotedTileType = Class.new(Types::BaseObject) do
        field :tile_id, ID, null: false
        field :what_to_discard_problem_id, ID, null: false
      end

      type [ VotedTileType ], null: false
      argument :what_to_discard_problem_ids, [ ID ], required: true

      def resolve(what_to_discard_problem_ids:)
        return [] unless logged_in?

        votes = current_user
                .created_what_to_discard_problem_votes
                .where(what_to_discard_problem_id: what_to_discard_problem_ids)
                .select(:tile_id, :what_to_discard_problem_id)

        votes.map do |vote|
          {
            tile_id: vote.tile_id,
            what_to_discard_problem_id: vote.what_to_discard_problem_id,
          }
        end
      end
    end
  end
end
