# frozen_string_literal: true

module Mutations
  module Auth
    class RequestAuth < BaseMutation
      include Authenticatable

      field :success, Boolean, null: false

      argument :email, String, required: true

      def resolve(email:)
        raise GraphQL::ExecutionError, "既にログインしています" if logged_in?

        auth_request = AuthRequest.new(email:)

        if auth_request.save
          AuthorizationMailer.send_authorization_token(auth_request).deliver_now

          session[:pending_auth_email] = email

          { success: true }
        else
          auth_request.errors.full_messages.each do |message|
            context.add_error(GraphQL::ExecutionError.new(message))
          end
          nil
        end
      end
    end
  end
end
