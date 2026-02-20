# frozen_string_literal: true

class SessionsController < ApplicationController
  before_action :restrict_to_logged_in_user, only: %i[destroy]

  def show
    render json: current_user,
      serializer: SessionSerializer,
      root: :session,
      status: :ok
  end

  def destroy
    logout
    head :no_content
  end
end
