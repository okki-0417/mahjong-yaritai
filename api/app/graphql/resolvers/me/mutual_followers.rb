# frozen_string_literal: true

module Resolvers
  module Me
    class MutualFollowers < BaseResolver
      include Authenticatable

      type Types::UserType.connection_type, null: false

      def resolve
        require_authentication!

        following_ids = current_user.following_ids
        current_user.followers
                    .where(id: following_ids)
                    .preload(avatar_attachment: :blob)
      end
    end
  end
end
