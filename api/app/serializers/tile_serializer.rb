# frozen_string_literal: true

class TileSerializer < ActiveModel::Serializer
  attributes %i[
    id
    suit
    ordinal_number_in_suit
    name
    created_at
    updated_at
  ]
end
