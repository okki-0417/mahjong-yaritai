# frozen_string_literal: true

class WhatToDiscardProblem::Vote::ResultSerializer < ActiveModel::Serializer
  attributes %i[
    tile_id
    count
  ]

  def tile_id
    object&.[](:tile_id)
  end

  def count
    object&.[](:count)
  end
end
