# frozen_string_literal: true

module Mutations
  module Follows
    class CreateFollow < BaseMutation
      include Authenticatable

      argument :user_id, ID, required: true

      field :follow, Types::FollowType, null: false

      def resolve(user_id:)
        require_authentication!

        follow = current_user.active_follows.new(followee_id: user_id)

        if follow.save
          { follow: }
        else
          follow.errors.full_messages.each do |message|
            context.add_error(GraphQL::ExecutionError.new(message))
          end
          nil
        end
      end
    end
  end
end
