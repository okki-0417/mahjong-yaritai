# frozen_string_literal: true

module Resolvers
  module Me
    class ParticipatedMahjongSession < BaseResolver
      include Authenticatable

      type Types::MahjongSessionType, null: false

      argument :id, ID, required: true

      def resolve(id:)
        require_authentication!

        current_user
          .participated_mahjong_sessions
          .find(id)
      end
    end
  end
end
