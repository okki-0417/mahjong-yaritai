# frozen_string_literal: true

class WhatToDiscardProblems::VotesController < ApplicationController
  before_action :authorize_request

  def create
    what_to_discard_problem = WhatToDiscardProblem.find(params[:what_to_discard_problem_id])

    # 既存の投票があれば削除（上書き）
    previous_vote = current_user.created_what_to_discard_problem_votes
                                .find_by(what_to_discard_problem:)
    previous_vote&.destroy

    @vote = current_user.created_what_to_discard_problem_votes.new(
      what_to_discard_problem:,
      tile_id: params[:tile_id]
    )

    if @vote.save
      render :show, status: :created
    else
      render_error(@vote.errors.full_messages.join(", "), status: :unprocessable_entity)
    end
  end

  def destroy
    what_to_discard_problem = WhatToDiscardProblem.find(params[:what_to_discard_problem_id])

    @vote = current_user.created_what_to_discard_problem_votes.find_by!(what_to_discard_problem:)

    if @vote.destroy
      head :no_content
    else
      render_error(@vote.errors.full_messages.join(", "), status: :unprocessable_entity)
    end
  end
end
