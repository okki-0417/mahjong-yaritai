# frozen_string_literal: true

class ApplicationController < ActionController::API
  include Controllers::Authenticatable
  include ErrorRenderable

  include Rails.application.routes.url_helpers
  include ActionController::RequestForgeryProtection

  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found

  private

  def render_not_found
    render_error "リソースが見つかりませんでした", status: :not_found
  end
end
