# frozen_string_literal: true

module Types
  class WhatToDiscardProblemVoteType < Types::BaseObject
    field :id, ID, null: false
    field :tile_id, ID, null: false
    field :what_to_discard_problem_id, ID, null: false
    field :user_id, ID, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    field :tile, Types::TileType, null: false
    def tile
      object.tile
    end
  end
end
