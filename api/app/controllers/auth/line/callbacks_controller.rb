# frozen_string_literal: true

require "net/http"

class Auth::Line::CallbacksController < ApplicationController
  def create
    code = params[:code]
    state = params[:state]
    line_login_id = params[:line_login_id]

    line_login = find_line_login(line_login_id)

    if line_login.nil? || state.blank? || state != line_login.state
      return render json: { errors: [ "パラメーターが不正です" ] }, status: :bad_request
    end

    if code.blank?
      return render json: { errors: [ "Authorization code が存在しません" ] }, status: :bad_request
    end

    token_response = exchange_code_for_token(code)

    if token_response[:error]
      return render json: { errors: [ token_response[:error] ] }, status: :unprocessable_entity
    end

    user_data = verify_id_token(token_response[:id_token])

    if user_data[:error]
      return render json: { errors: [ user_data[:error] ] }, status: :unprocessable_entity
    end

    user = User.find_by(email: user_data[:email])

    if user
      @user_name = user.name
      @access_token, @refresh_token = login(user)

      render :show, status: :created
    else
      auth_request = AuthRequest.new(email: user_data[:email])

      if auth_request.save
        @encrypted_email = EncryptionService.encrypt(auth_request.email)

        render :show, status: :created
      else
        render json: { errors: auth_request.errors.full_messages }, status: :unprocessable_entity
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

  def find_line_login(encrypted_id)
    return nil if encrypted_id.blank?

    id = EncryptionService.decrypt(encrypted_id)
    LineLogin.find_by(id:)
  rescue ActiveSupport::MessageEncryptor::InvalidMessage
    nil
  end
end
