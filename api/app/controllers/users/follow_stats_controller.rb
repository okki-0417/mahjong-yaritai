# frozen_string_literal: true

class Users::FollowStatsController < ApplicationController
  def show
    user = User.find(params[:user_id])
    @following_count = user.followings.count
    @followers_count = user.followers.count
  end
end
