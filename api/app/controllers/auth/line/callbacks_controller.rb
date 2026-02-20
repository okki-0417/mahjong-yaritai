# frozen_string_literal: true

require "net/http"

class Auth::Line::CallbacksController < ApplicationController
  def create
    code = params[:code]
    state = params[:state]

    if state.blank? || state != session[:line_login_state]
      return render json: error_json([ "Invalid state parameter" ]), status: :bad_request
    end

    session.delete(:line_login_state)

    if code.blank?
      return render json: error_json([ "Authorization code is missing" ]), status: :bad_request
    end

    token_response = exchange_code_for_token(code)

    if token_response[:error]
      return render json: error_json([ token_response[:error] ]), status: :unprocessable_entity
    end

    user_data = verify_id_token(token_response[:id_token])

    if user_data[:error]
      return render json: error_json([ user_data[:error] ]), status: :unprocessable_entity
    end

    user = User.find_by(email: user_data[:email])

    if user
      login user
      remember user

      render json: user,
        serializer: SessionSerializer,
        root: :session,
        status: :ok
    else
      auth_request = AuthRequest.new(email: user_data[:email])

      if auth_request.save
        session[:auth_request_id] = auth_request.id
        render body: nil, status: :no_content
      else
        render json: validation_error_json(auth_request), status: :unprocessable_entity
      end
    end
  end

  private

  def exchange_code_for_token(code)
    uri = URI("https://api.line.me/oauth2/v2.1/token")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(uri)
    request["Content-Type"] = "application/x-www-form-urlencoded"
    request.body = URI.encode_www_form({
      grant_type: "authorization_code",
      code:,
      redirect_uri: ENV.fetch("LINE_REDIRECT_URI"),
      client_id: ENV.fetch("LINE_CHANNEL_ID"),
      client_secret: ENV.fetch("LINE_CHANNEL_SECRET"),
    })

    response = http.request(request)

    if response.code == "200"
      data = JSON.parse(response.body)
      {
        access_token: data["access_token"],
        id_token: data["id_token"],
        refresh_token: data["refresh_token"],
      }
    else
      error_data = JSON.parse(response.body) rescue {}
      { error: error_data["error_description"] || "Failed to exchange code for token" }
    end
  rescue => e
    { error: e.message }
  end

  def verify_id_token(id_token)
    # LINE IDトークンを検証
    uri = URI("https://api.line.me/oauth2/v2.1/verify")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(uri)
    request["Content-Type"] = "application/x-www-form-urlencoded"
    request.body = URI.encode_www_form({
      id_token:,
      client_id: ENV.fetch("LINE_CHANNEL_ID"),
    })

    response = http.request(request)

    if response.code == "200"
      data = JSON.parse(response.body)
      { email: data["email"] }
    else
      { error: "IDトークンの検証に失敗しました" }
    end
  rescue => e
    { error: e.message }
  end
end
