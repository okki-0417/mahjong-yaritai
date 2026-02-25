# frozen_string_literal: true

class Me::FollowingsController < ApplicationController
  before_action :authorize_request

  def create
    target_user = User.find(params[:target_user_id])

    if @current_user.following?(target_user)
      render json: { errors: ["既にフォローしています"] }, status: :unprocessable_entity
      return
    end

    follow = @current_user.follow(target_user)

    if follow.persisted?
      head :created
    else
      render json: { errors: follow.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    target_user = User.find(params[:id])

    follow = @current_user.active_follows.find_by(followee: target_user)

    if follow.nil?
      render json: { errors: ["フォローしていません"] }, status: :not_found
      return
    end

    follow.destroy
    head :no_content
  end
end
