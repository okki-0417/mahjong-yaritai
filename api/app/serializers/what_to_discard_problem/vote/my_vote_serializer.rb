# frozen_string_literal: true

class WhatToDiscardProblem::Vote::MyVoteSerializer < ActiveModel::Serializer
  attributes %i[
    id
    tile
  ]

  def id
    object&.id
  end

  def tile
    object&.tile
  end
end
