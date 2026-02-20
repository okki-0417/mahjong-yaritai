# frozen_string_literal: true

class WhatToDiscardProblem::Vote < ApplicationRecord
  self.table_name = :what_to_discard_problem_votes

  belongs_to :user
  belongs_to :what_to_discard_problem, counter_cache: true
  belongs_to :tile

  validates :user_id, uniqueness: { scope: :what_to_discard_problem }

  def voted_by?(user)
    user_id == user.id
  end
end
