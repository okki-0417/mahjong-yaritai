# frozen_string_literal: true

class MahjongSessionForm
  include ActiveModel::Model
  include ActiveModel::Attributes

  MIN_PARTICIPANTS = 3
  MIN_GAMES = 1

  attr_accessor :creator_user

  attribute :name, :string
  attribute :rate, :integer
  attribute :chip_amount, :integer
  attribute :participant_users, default: -> { [] }
  attribute :games, default: -> { [] }

  validates :creator_user, presence: true
  validates :name, presence: true
  validates :rate, presence: true, numericality: { only_integer: true }
  validates :chip_amount, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validate :validate_participants_count
  validate :validate_games_count
  validate :validate_game_results

  attr_reader :mahjong_session

  def save
    return false unless valid?

    ActiveRecord::Base.transaction do
      mahjong_scoring_setting = MahjongScoringSetting.create!(
        rate:,
        chip_amount:
      )

      @mahjong_session = creator_user.created_mahjong_sessions.create!(
        name:,
        mahjong_scoring_setting:,
      )

      participants = participant_users.map do |participant_data|
        data = participant_data.symbolize_keys
        @mahjong_session.mahjong_participants.create!(
          user_id: data[:user_id],
          name: data[:name]
        )
      end

      games.each do |game_data|
        game = @mahjong_session.mahjong_games.create!

        results = game_data.symbolize_keys[:results] || []
        results.each_with_index do |result_data, index|
          data = result_data.symbolize_keys
          game.mahjong_results.create!(
            mahjong_participant: participants[index],
            result_points: data[:result_points],
            ranking: data[:ranking]
          )
        end
      end
    end

    true
  rescue ActiveRecord::RecordInvalid => e
    errors.add(:base, e.message)
    false
  end

  private

  def validate_participants_count
    return unless participant_users.size < MIN_PARTICIPANTS

    errors.add(:participant_users, "は最低#{MIN_PARTICIPANTS}人以上必要です")
  end

  def validate_games_count
    return unless games.size < MIN_GAMES

    errors.add(:games, "は最低#{MIN_GAMES}つ以上必要です")
  end

  def validate_game_results
    games.each_with_index do |game, index|
      results = game.symbolize_keys[:results] || []

      if results.size < MIN_PARTICIPANTS
        errors.add(:base, "#{index + 1}戦目の結果をすべて入力してください")
      end
    end
  end
end
