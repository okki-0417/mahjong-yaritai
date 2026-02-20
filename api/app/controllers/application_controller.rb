# frozen_string_literal: true

class ApplicationController < ActionController::API
  include Controllers::Authenticatable
  include ErrorJsonRenderable

  include Rails.application.routes.url_helpers
  include ActionController::RequestForgeryProtection

  def reject_logged_in_user
    render json: error_json([ "Already Logged In" ]), status: :forbidden if logged_in?
  end

  def restrict_to_logged_in_user
    render json: { errors: [ message: "Please Login" ] }, status: :unauthorized unless logged_in?
  end
end
