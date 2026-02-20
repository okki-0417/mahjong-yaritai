# frozen_string_literal: true

module Mutations
  module Users
    class UpdateUser < BaseMutation
      include Authenticatable

      field :user, Types::UserType, null: false

      argument :name, String, required: true
      argument :profile_text, String, required: true
      argument :avatar, ApolloUploadServer::Upload, required: false

      def resolve(name:, profile_text:, avatar: nil)
        require_authentication!

        if avatar.present?
          current_user.avatar.attach(
            io: avatar.tempfile,
            filename: avatar.original_filename,
            content_type: avatar.content_type
          )
        end

        if current_user.update(name:, profile_text:)
          { user: current_user }
        else
          current_user.errors.full_messages.each do |message|
            context.add_error(GraphQL::ExecutionError.new(message))
          end
          nil
        end
      end
    end
  end
end
