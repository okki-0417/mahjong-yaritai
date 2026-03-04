# frozen_string_literal: true

class WhatToDiscardProblemsController < ApplicationController
  before_action :authorize_request, only: %i[update destroy]

  def index
    limit = [(params[:first] || 10).to_i, 50].min

    problems = WhatToDiscardProblem.preload(user: { avatar_attachment: :blob }).order(id: :desc)

    if params[:after].present?
      problems = problems.where("id < ?", params[:after].to_i)
    end

    problems = problems.limit(limit + 1).to_a

    has_next = problems.size > limit
    @problems = problems.first(limit)

    @page_info = {
      has_next_page: has_next,
      has_previous_page: params[:after].present?,
      start_cursor: @problems.first&.id,
      end_cursor: @problems.last&.id,
  }

    set_current_user_interactions(@problems)
  end

  def show
    @problem = WhatToDiscardProblem.find(params[:id])
    set_current_user_interactions(@problem)
  end

  def update
    @problem = current_user.created_what_to_discard_problems.find(params[:id])

    if @problem.update(what_to_discard_problem_params)
      set_current_user_interactions(@problem)
      render :show
    else
      render_error(@problem.errors.full_messages.join(", "), status: :unprocessable_entity)
    end
  end

  def destroy
    problem = current_user.created_what_to_discard_problems.find(params[:id])

    problem.destroy!

    head :no_content
  end

  private

  def set_current_user_interactions(problems)
    problems = Array(problems)
    problem_ids = problems.map(&:id)

    @my_like_ids_by_problem_id = current_user&.created_likes&.where(likable: problems)&.pluck(:likable_id, :id)&.to_h || {}
    @my_vote_tile_ids = current_user&.created_what_to_discard_problem_votes&.where(what_to_discard_problem_id: problem_ids)&.pluck(:what_to_discard_problem_id, :tile_id)&.to_h || {}
  end

  def what_to_discard_problem_params
    params.permit(
      :round,
      :turn,
      :wind,
      :dora_id,
      :hand1_id,
      :hand2_id,
      :hand3_id,
      :hand4_id,
      :hand5_id,
      :hand6_id,
      :hand7_id,
      :hand8_id,
      :hand9_id,
      :hand10_id,
      :hand11_id,
      :hand12_id,
      :hand13_id,
      :tsumo_id,
      :points,
      :description,
    )
  end
end
