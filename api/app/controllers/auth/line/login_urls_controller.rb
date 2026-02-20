# frozen_string_literal: true

class Auth::Line::LoginUrlsController < ApplicationController
  def show
    state = SecureRandom.hex(32)
    session[:line_login_state] = state

    login_url = build_line_login_url(state)

    render json: { login_url: }, status: :ok
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
