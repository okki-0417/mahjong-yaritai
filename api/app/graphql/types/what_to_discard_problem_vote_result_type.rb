# frozen_string_literal: true

module Types
  class WhatToDiscardProblemVoteResultType < Types::BaseObject
    field :tile_id, ID, null: false
    field :count, Integer, null: false
    field :percentage, Float, null: false
  end
end
