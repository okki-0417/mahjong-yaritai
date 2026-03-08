# frozen_string_literal: true

class WhatToDiscardProblems::CommentsController < ApplicationController
  before_action :authorize_request, only: %i[create]

  def index
    problem = WhatToDiscardProblem.find(params[:what_to_discard_problem_id])
    @comments = problem.comments.parents.preload(user: { avatar_attachment: :blob }).order(created_at: :desc)
  end

  def replies
    comment = Comment.find(params[:comment_id])
    @comments = comment.replies.preload(user: { avatar_attachment: :blob }).order(created_at: :desc)
    render :index
  end

  def create
    problem = WhatToDiscardProblem.find_by(id: params[:what_to_discard_problem_id])
    unless problem
      return render_error("何切る問題が見つかりません", status: :not_found)
    end

    @comment = problem.comments.new(comment_params.merge(user: current_user))

    if @comment.save
      render :show, status: :created
    else
      render_error(@comment.errors.full_messages.join(", "), status: :unprocessable_entity)
    end
  end

  private

  def comment_params
    params.require(:comment).permit(:content, :parent_comment_id)
  end
end
