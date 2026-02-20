# frozen_string_literal: true

module Types
  class SessionType < Types::BaseObject
    description "User session information"

    field :is_logged_in, Boolean, null: false
    field :user_id, Integer, null: true
    field :user, Types::UserType, null: true
  end
end
