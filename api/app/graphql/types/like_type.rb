# frozen_string_literal: true

module Types
  class LikeType < Types::BaseObject
    field :id, ID, null: false
    field :user_id, ID, null: false
    field :likable_id, ID, null: false
    field :likable_type, String, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
