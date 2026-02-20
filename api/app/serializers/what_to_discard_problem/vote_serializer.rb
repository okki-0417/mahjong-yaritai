# frozen_string_literal: true

class WhatToDiscardProblem::VoteSerializer < ActiveModel::Serializer
  attributes %i[
    id
    user_id
    what_to_discard_problem_id
    tile_id
    created_at
    updated_at
  ]

  # belongs_to :user, serializer: UserSerializer
  # belongs_to :what_to_discard_problem, serializer: WhatToDiscardProblemSerializer
  belongs_to :tile, serializer: TileSerializer
end
