# frozen_string_literal: true

module Controllers
  module Authenticatable
    include ActionController::Cookies
    include ErrorRenderable

    private

    def reject_logged_in_user
      render_error "すでにログインしています", status: :forbidden if logged_in?
    end

    def restrict_to_logged_in_user
      render_error "ログインしてください", status: :unauthorized unless logged_in?
    end

    def authorize_request
      header = request.headers["Authorization"]
      token = header.split(" ").last if header

      return render_error("認証が必要です", status: :unauthorized) unless token

      begin
        decoded = JWT.decode(token, Rails.application.secret_key_base).first
        @current_user = User.find_by(id: decoded["user_id"])

        render_error("ユーザーが存在しません", status: :unauthorized) unless @current_user
      rescue JWT::ExpiredSignature
        render_error "認証の有効期限が切れています", status: :unauthorized
      rescue JWT::DecodeError
        render_error "無効な認証情報です", status: :unauthorized
      end
    end

    def login(user)
      access_token_payload = {
        user_id: user.id,
        exp: (Time.now + 1.hour).to_i,
      }

      user.regenerate_jti!
      refresh_token_payload = {
        user_id: user.id,
        jti: user.jti,
        exp: (Time.now + 30.days).to_i,
      }

      access_token = JWT.encode(access_token_payload, Rails.application.secret_key_base)
      refresh_token = JWT.encode(refresh_token_payload, Rails.application.secret_key_base)

      [access_token, refresh_token]
    end

    def current_user
      return @current_user if defined?(@current_user)

      header = request.headers["Authorization"]
      return @current_user = nil unless header

      token = header.split(" ").last
      return @current_user = nil unless token

      decoded = JWT.decode(token, Rails.application.secret_key_base).first
      @current_user = User.find_by(id: decoded["user_id"])
    rescue JWT::DecodeError, JWT::ExpiredSignature
      @current_user = nil
    end

    def logged_in?
      current_user.present?
    end
  end
end
