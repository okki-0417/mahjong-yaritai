# frozen_string_literal: true

class MahjongParticipant < ApplicationRecord
  NAME_MAX_LENGTH = 20
  DEFAULT_NAME = "NO NAME"

  validates :user_id, uniqueness: { scope: :mahjong_session_id, message: "はすでにこのセッションに参加しています", allow_nil: true }
  validates :name, presence: true, length: { minimum: 1, maximum: NAME_MAX_LENGTH }

  belongs_to :mahjong_session
  belongs_to :user, optional: true

  after_initialize :set_default_name, if: :new_record?

  has_many :mahjong_results, dependent: :destroy
  has_many :mahjong_games, through: :mahjong_results

  def winner_games
    mahjong_results.where(ranking: 1).map(&:mahjong_game)
  end

  def total_points
    mahjong_results.sum(:result_points)
  end

  def average_ranking
    mahjong_results.average(:ranking).to_f.round(2)
  end

  def total_profits
    total_points * mahjong_session.rate
  end

  private

  def set_default_name
    self.name ||= user&.name || DEFAULT_NAME
  end
end
