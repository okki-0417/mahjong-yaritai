# frozen_string_literal: true

module Controllers
  module Authenticatable
    include ActionController::Cookies

    def current_user
      @current_user ||= begin
        if user_id = session[:user_id]
          User.find_by(id: user_id)
        elsif user_id = cookies.signed[:user_id]
          remember_token = cookies.signed[:remember_token]
          return nil unless remember_token

          user = User.find_by(id: user_id)
          return nil unless user&.authenticated?(remember_token)

          login user
          user
        else
          nil
        end
      end
    end

    def logged_in?
      current_user.present?
    end
  end
end
