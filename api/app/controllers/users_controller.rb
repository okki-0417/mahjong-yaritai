class UsersController < ApplicationController
  def show
    @user = User.find(params[:id])

    Rails.logger.debug "following? #{current_user&.following?(@user)}"
    @is_followed_by_me = current_user&.following?(@user) || false
  end
end
