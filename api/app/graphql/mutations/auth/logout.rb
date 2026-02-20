# frozen_string_literal: true

module Mutations
  module Auth
    class Logout < BaseMutation
      include Authenticatable

      field :success, Boolean, null: false

      def resolve
        require_authentication!

        logout

        { success: true }
      end
    end
  end
end
