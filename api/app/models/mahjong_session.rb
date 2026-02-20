# frozen_string_literal: true

class MahjongSession < ApplicationRecord
  attribute :name, :string, default: -> { Time.current.strftime("%Y年%m月%d日") }

  belongs_to :creator_user, class_name: :User
  belongs_to :mahjong_scoring_setting

  has_many :mahjong_games, dependent: :destroy
  has_many :mahjong_participants, dependent: :destroy
  has_many :participant_users, through: :mahjong_participants, source: :user


  delegate :rate, :chip_amount, :uma_rule_label, :oka_rule_label, to: :mahjong_scoring_setting

  def total_points_for(user)
    return 0 unless user

    mahjong_participants.find_by(user_id: user.id)&.total_points || 0
  end

  def average_ranking_for(user)
    return 0 unless user

    mahjong_participants.find_by(user_id: user.id)&.average_ranking || 0
  end

  def total_profits_for(user)
    return 0 unless user

    mahjong_participants.find_by(user_id: user.id)&.total_profits || 0
  end
end
