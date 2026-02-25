class Auth::StatusesController < ApplicationController
  def show
    render json: { logged_in: logged_in? }
  end
end
