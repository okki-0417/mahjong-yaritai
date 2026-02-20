# frozen_string_literal: true

module Mutations
  module Auth
    class VerifyAuth < BaseMutation
      include Authenticatable

      field :user, Types::UserType, null: true

      argument :token, String, required: true

      def resolve(token:)
        raise GraphQL::ExecutionError, "既にログインしています" if logged_in?

        email = session[:pending_auth_email]
        raise GraphQL::ExecutionError, "メールアドレスが未設定です" unless email

        auth_request = AuthRequest.find_by(email:, token:)
        raise GraphQL::ExecutionError, "認証リクエストが見つかりません" unless auth_request
        raise GraphQL::ExecutionError, "認証が切れています" if auth_request.expired?

        session.delete(:pending_auth_email)

        if user = User.find_by(email:)
          login(user)
          { user: }
        else
          session[:auth_request_id] = auth_request.id
          { user: nil }
        end
      end
    end
  end
end
