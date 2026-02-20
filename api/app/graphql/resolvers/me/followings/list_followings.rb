# frozen_string_literal: true

module Resolvers
  module Me
    module Followings
      class ListFollowings < BaseResolver
        include Authenticatable

        type Types::UserType.connection_type, null: false

        def resolve
          return User.none unless logged_in?

          current_user
            .followings
            .preload(avatar_attachment: :blob)
            .order(id: :desc)
        end
      end
    end
  end
end
