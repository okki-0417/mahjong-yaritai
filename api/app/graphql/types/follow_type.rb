# frozen_string_literal: true

module Types
  class FollowType < Types::BaseObject
    field :id, ID, null: false
    field :follower_id, ID, null: false
    field :followee_id, ID, null: false
    field :follower, Types::UserType, null: false
    field :followee, Types::UserType, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
