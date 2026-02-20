# frozen_string_literal: true

class WhatToDiscardProblemSerializer < ActiveModel::Serializer
  attributes %i[
    id
    round
    turn
    wind
    points
    user_id
    dora_id
    hand1_id
    hand2_id
    hand3_id
    hand4_id
    hand5_id
    hand6_id
    hand7_id
    hand8_id
    hand9_id
    hand10_id
    hand11_id
    hand12_id
    hand13_id
    tsumo_id
    description
    comments_count
    likes_count
    votes_count
    created_at
    updated_at
  ]

  belongs_to :user, serializer: UserSerializer
end
