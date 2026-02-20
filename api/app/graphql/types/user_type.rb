# frozen_string_literal: true

module Types
  class UserType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :email, String, null: true
    field :profile_text, String, null: true
    field :avatar_url, String, null: true
    field :is_following, Boolean, null: true
    field :following_count, Integer, null: true
    field :followers_count, Integer, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    def avatar_url
      return nil unless object.avatar.attached?

      begin
        object.avatar.url
      rescue
        Rails.application.routes.url_helpers.url_for(object.avatar)
      end
    end

    def is_following
      context[:is_following]
    end

    def following_count
      context[:followings_count] || nil
    end

    def followers_count
      context[:followers_count] || nil
    end
  end
end
