# frozen_string_literal: true

class Auth::Line::LoginUrlsController < ApplicationController
  def create
    line_login = LineLogin.create!(state: SecureRandom.hex(32))

    login_url = build_line_login_url(line_login.state)
    encrypted_line_login_id = EncryptionService.encrypt(line_login.id)

    render json: { login_url:, line_login_id: encrypted_line_login_id }, status: :created
  end

  private

  def build_line_login_url(state)
    params = {
      response_type: "code",
      client_id: ENV.fetch("LINE_CHANNEL_ID"),
      redirect_uri: ENV.fetch("LINE_REDIRECT_URI"),
      state:,
      scope: "openid email",
    }

    "https://access.line.me/oauth2/v2.1/authorize?#{params.to_query}"
  end
end
