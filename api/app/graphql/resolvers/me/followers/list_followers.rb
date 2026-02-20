# frozen_string_literal: true

module Resolvers
  module Me
    module Followers
      class ListFollowers < BaseResolver
        include Authenticatable

        type Types::UserType.connection_type, null: false

        def resolve
          return User.none unless logged_in?

          current_user.followers.includes(avatar_attachment: :blob).order("follows.created_at DESC")
        end
      end
    end
  end
end
