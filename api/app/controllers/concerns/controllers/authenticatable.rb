# frozen_string_literal: true

module Controllers
  module Authenticatable
    include ActionController::Cookies

    def login(user)
      reset_session

      session[:user_id] = user.id
    end

    def remember(user)
      user.remember

      cookies.permanent.signed[:user_id] = {
        value: user.id,
        domain: Rails.env.production? ? ENV.fetch("ETLD_HOST") : "localhost",
        same_site: :lax,
        secure: Rails.env.production?,
        httponly: true,
      }

      cookies.permanent.signed[:remember_token] = {
        value: user.remember_token,
        domain: Rails.env.production? ? ENV.fetch("ETLD_HOST") : "localhost",
        same_site: :lax,
        secure: Rails.env.production?,
        httponly: true,
      }
    end

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

    def logout
      forget current_user
      reset_session
      @current_user = nil
    end

    def forget(user)
      user.forget
      cookies.delete(:user_id)
      cookies.delete(:remember_token)
    end

    def logged_in?
      current_user.present?
    end
  end
end
