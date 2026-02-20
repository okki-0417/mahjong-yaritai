# frozen_string_literal: true

module Types
  class TileType < Types::BaseObject
    field :id, ID, null: false
    field :suit, String, null: false
    field :name, String, null: false
    field :ordinal_number_in_suit, Integer, null: false
  end
end
