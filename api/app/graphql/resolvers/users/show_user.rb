# frozen_string_literal: true

module Resolvers
  module Users
    class ShowUser < BaseResolver
      include Authenticatable

      type Types::UserType, null: true

      argument :id, ID, required: true

      def resolve(id:)
        user = User.find(id)

        context[:is_following] = current_user&.following?(user)
        context[:followings_count] = user.followings.count
        context[:followers_count] = user.followers.count

        user
      end
    end
  end
end
