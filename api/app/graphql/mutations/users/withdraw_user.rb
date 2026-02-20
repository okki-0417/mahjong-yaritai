# frozen_string_literal: true

module Mutations
  module Users
    class WithdrawUser < BaseMutation
      include Authenticatable

      field :success, Boolean, null: false

      def resolve
        require_authentication!

        withdraw_user = current_user
        logout

        if withdraw_user.destroy
          { success: true }
        else
          withdraw_user.errors.full_messages.each do |message|
            context.add_error(GraphQL::ExecutionError.new(message))
          end
          nil
        end
      end
    end
  end
end
