# frozen_string_literal: true

class WhatToDiscardProblem < ApplicationRecord
  belongs_to :user
  has_many :comments, as: :commentable, dependent: :destroy
  has_many :likes, as: :likable, dependent: :destroy
  has_many :votes, class_name: "WhatToDiscardProblem::Vote", dependent: :destroy

  belongs_to :dora, class_name: :Tile
  belongs_to :hand1, class_name: :Tile
  belongs_to :hand2, class_name: :Tile
  belongs_to :hand3, class_name: :Tile
  belongs_to :hand4, class_name: :Tile
  belongs_to :hand5, class_name: :Tile
  belongs_to :hand6, class_name: :Tile
  belongs_to :hand7, class_name: :Tile
  belongs_to :hand8, class_name: :Tile
  belongs_to :hand9, class_name: :Tile
  belongs_to :hand10, class_name: :Tile
  belongs_to :hand11, class_name: :Tile
  belongs_to :hand12, class_name: :Tile
  belongs_to :hand13, class_name: :Tile
  belongs_to :tsumo, class_name: :Tile

  validate :confirm_no_more_than_four_duplicated_tiles
  validate :confirm_tiles_are_sorted

  def hand_ids
    [ hand1_id, hand2_id, hand3_id, hand4_id, hand5_id, hand6_id, hand7_id, hand8_id, hand9_id, hand10_id, hand11_id, hand12_id, hand13_id, tsumo_id ]
  end

  def voted_by?(user)
    votes.exists?(user_id: user.id)
  end

  def liked_by?(user)
    likes.exists?(user_id: user.id)
  end

  def votes_by(**user_ids)
    votes.where(user_id: user_ids)
  end

  def likes_by(**user_ids)
    likes.where(user_id: user_ids)
  end

  private

  def confirm_no_more_than_four_duplicated_tiles
    counts = hand_ids.tally

    return if counts.all? { |_, count| count <= 4 }

    errors.add(:base, :too_many_duplicated_tiles)
  end

  def confirm_tiles_are_sorted
    hand_tile_ids = [
      hand1_id, hand2_id, hand3_id, hand4_id, hand5_id, hand6_id, hand7_id,
      hand8_id, hand9_id, hand10_id, hand11_id, hand12_id, hand13_id,
    ]

    return if hand_tile_ids == hand_tile_ids.sort

    errors.add(:base, :tiles_not_sorted)
  end
end
