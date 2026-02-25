# frozen_string_literal: true

class ApplicationController < ActionController::API
  include Controllers::Authenticatable
  include ErrorJsonRenderable

  include Rails.application.routes.url_helpers
  include ActionController::RequestForgeryProtection

  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found

  private

  def render_not_found
    render json: { errors: ["リソースが見つかりません"] }, status: :not_found
  end

  public

  def reject_logged_in_user
    render json: error_json([ "Already Logged In" ]), status: :forbidden if logged_in?
  end

  def restrict_to_logged_in_user
    render json: { errors: [ message: "Please Login" ] }, status: :unauthorized unless logged_in?
  end

  def authorize_request
    header = request.headers["Authorization"]
    token = header.split(" ").last if header

    return render json: { errors: [ "トークンが見つかりません" ] }, status: :unauthorized unless token

    begin
      decoded = JWT.decode(token, Rails.application.secret_key_base).first
      @current_user = User.find_by(id: decoded["user_id"])

      render json: { errors: [ "ユーザーが存在しません" ] }, status: :unauthorized unless @current_user
    rescue JWT::ExpiredSignature
      render json: { errors: [ "トークンの有効期限が切れています" ] }, status: :unauthorized
    rescue JWT::DecodeError
      render json: { errors: [ "無効なトークンです" ] }, status: :unauthorized
    end
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
end
