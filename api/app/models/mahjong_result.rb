# frozen_string_literal: true

class MahjongResult < ApplicationRecord
  validates :score, numericality: { only_integer: true }, allow_nil: true
  validates :result_points, numericality: true, presence: true
  validates :ranking, presence: true, numericality: { only_integer: true, greater_than: 0, less_than_or_equal_to: 4 }
  validates :mahjong_participant_id, uniqueness: { scope: :mahjong_game_id, message: "はすでにこのゲームに結果が登録されています" }

  belongs_to :mahjong_participant
  belongs_to :mahjong_game

  delegate :user, to: :mahjong_participant
end
