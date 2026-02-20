# frozen_string_literal: true

class MahjongScoringSetting < ApplicationRecord
  attribute :rate, default: 100
  attribute :chip_amount, default: 0

  validates :rate, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :chip_amount, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
end
