class WhatToDiscardProblems::LikesController < ApplicationController
  before_action :authorize_request

  def create
    what_to_discard_problem = WhatToDiscardProblem.find_by(id: params[:what_to_discard_problem_id])
    unless what_to_discard_problem
      return render_error("何切る問題が見つかりません", status: :not_found)
    end

    @like = what_to_discard_problem.likes.new(user: current_user)

    if @like.save
      render :show, status: :created
    else
      render_error(@like.errors.full_messages.join(", "), status: :unprocessable_entity)
    end
  end

  def destroy
    what_to_discard_problem = WhatToDiscardProblem.find_by(id: params[:what_to_discard_problem_id])
    unless what_to_discard_problem
      return render_error("何切る問題が見つかりません", status: :not_found)
    end

    @like = what_to_discard_problem.likes.find_by(id: params[:id])
    unless @like
      return render_error("いいねが見つかりません", status: :not_found)
    end

    if @like.destroy
      head :no_content
    else
      render_error(@like.errors.full_messages.join(", "), status: :unprocessable_entity)
    end
  end
end
