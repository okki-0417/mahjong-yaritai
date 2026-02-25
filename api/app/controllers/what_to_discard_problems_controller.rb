# frozen_string_literal: true

class WhatToDiscardProblemsController < ApplicationController
  def index
    limit = [(params[:first] || 10).to_i, 50].min

    # maybe avatar_blob... の書き方は間違っている
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

    @liked_problem_ids = current_user&.created_likes&.where(likable: @problems)&.pluck(:likable_id) || []
    @my_vote_tile_ids = current_user&.created_what_to_discard_problem_votes&.where(what_to_discard_problem_id: @problems.map(&:id))&.pluck(:what_to_discard_problem_id, :tile_id)&.to_h || {}
  end
end
