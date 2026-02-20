# frozen_string_literal: true

module Mutations
  module Follows
    class DeleteFollow < BaseMutation
      include Authenticatable

      field :id, ID, null: false

      argument :user_id, ID, required: true

      def resolve(user_id:)
        require_authentication!

        follow = current_user.active_follows.find_by!(followee_id: user_id)
        follow_id = follow.id

        if follow.destroy
          { id: follow_id }
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
