# frozen_string_literal: true

class MahjongGame < ApplicationRecord
  belongs_to :mahjong_session

  has_many :mahjong_results, dependent: :destroy
  has_many :mahjong_participants, through: :mahjong_results

  def winner
    mahjong_results.find_by(ranking: 1)&.mahjong_participant
  end
end
