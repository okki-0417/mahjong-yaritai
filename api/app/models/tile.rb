# frozen_string_literal: true

class Tile < ApplicationRecord
  enum :suit, %i[manzu pinzu souzu ji]
end
