class Auth::RefreshesController < ApplicationController
  def create
    refresh_token = params[:refresh_token]

    if refresh_token.blank?
      render json: { errors: ["リフレッシュトークンが見つかりませんでした"] }, status: :unauthorized
      return
    end

    begin
      decoded_token = JWT.decode(refresh_token, Rails.application.secret_key_base).first
      user_id = decoded_token["user_id"]

      if user = User.find_by(id: user_id)
        if user.jti != decoded_token["jti"]
          render json: { errors: ["リフレッシュトークンが無効化されています"] }, status: :unauthorized
        else
          access_token_payload = {
            user_id: user.id,
            exp: (Time.now + 1.hour).to_i,
          }
          access_token = JWT.encode(access_token_payload, Rails.application.secret_key_base)

          render json: { access_token: access_token }, status: :created
        end
      else
        render json: { errors: ["ユーザーが見つかりませんでした"] }, status: :unauthorized
      end
    rescue JWT::DecodeError
      render json: { errors: ["無効なリフレッシュトークンです"] }, status: :unauthorized
    rescue JWT::ExpiredSignature
      render json: { errors: ["リフレッシュトークンの有効期限が切れています"] }, status: :unauthorized
    end
  end
end
