class Auth::BaseController < ApplicationController
  private

  def restrict_to_guests
    return unless logged_in?

    render json: { error: "Already logged in" }, status: :forbidden
  end
end
