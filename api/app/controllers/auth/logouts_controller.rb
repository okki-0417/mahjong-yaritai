class Auth::LogoutsController < ApplicationController
  before_action :authorize_request

  def create
    @current_user.regenerate_jti!

    head :no_content
  end
end
