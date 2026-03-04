# frozen_string_literal: true

require "net/http"

class Auth::Google::CallbacksController < ApplicationController
  def create
    code = params[:code]

    if code.blank?
      return render json: { errors: [ "認証コードがありません" ] }, status: :bad_request
    end

    # コードからGoogleのアクセストークンを取得
    token_response = exchange_code_for_token(code)

    if token_response[:error]
      return render json: { errors: [ token_response[:error] ] }, status: :unprocessable_entity
    end

    # Googleからユーザー情報を取得
    user_info = fetch_google_user_info(token_response[:access_token])

    if user_info[:error]
      return render json: { errors: [ user_info[:error] ] }, status: :unprocessable_entity
    end

    user = User.find_by(email: user_info[:email])

    if user
      @user_name = user.name
      @access_token, @refresh_token = login(user)

      render :show, status: :created
    else
      auth_request = AuthRequest.new(email: user_info[:email])

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
    uri = URI("https://oauth2.googleapis.com/token")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(uri)
    request["Content-Type"] = "application/x-www-form-urlencoded"
    request.body = URI.encode_www_form({
      client_id: ENV.fetch("GOOGLE_CLIENT_ID"),
      client_secret: ENV.fetch("GOOGLE_CLIENT_SECRET"),
      code:,
      redirect_uri: ENV.fetch("GOOGLE_REDIRECT_URI"),
      grant_type: "authorization_code",
    })

    response = http.request(request)

    if response.code == "200"
      data = JSON.parse(response.body)
      { access_token: data["access_token"], id_token: data["id_token"] }
    else
      { error: "トークンの取得に失敗しました" }
    end
  rescue => e
    { error: "トークンの取得中にエラーが発生しました: #{e.message}" }
  end

  def fetch_google_user_info(access_token)
    uri = URI("https://www.googleapis.com/oauth2/v2/userinfo")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Get.new(uri)
    request["Authorization"] = "Bearer #{access_token}"

    response = http.request(request)

    if response.code == "200"
      data = JSON.parse(response.body)
      { email: data["email"] }
    else
      { error: "ユーザー情報の取得に失敗しました" }
    end
  rescue => e
    { error: "ユーザー情報の取得中にエラーが発生しました: #{e.message}" }
  end
end
