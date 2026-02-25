class MeController < ApplicationController
  before_action :authorize_request

  def show
  end

  def update
    if @current_user.update(user_params)
      render :show, status: :ok
    else
      render json: { errors: @current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.permit(:name, :profile_text, :avatar)
  end
end
