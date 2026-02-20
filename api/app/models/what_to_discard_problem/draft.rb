# frozen_string_literal: true

class WhatToDiscardProblem::Draft < WhatToDiscardProblem
  belongs_to :dora, class_name: :Tile, optional: true
  belongs_to :hand1, class_name: :Tile, optional: true
  belongs_to :hand2, class_name: :Tile, optional: true
  belongs_to :hand3, class_name: :Tile, optional: true
  belongs_to :hand4, class_name: :Tile, optional: true
  belongs_to :hand5, class_name: :Tile, optional: true
  belongs_to :hand6, class_name: :Tile, optional: true
  belongs_to :hand7, class_name: :Tile, optional: true
  belongs_to :hand8, class_name: :Tile, optional: true
  belongs_to :hand9, class_name: :Tile, optional: true
  belongs_to :hand10, class_name: :Tile, optional: true
  belongs_to :hand11, class_name: :Tile, optional: true
  belongs_to :hand12, class_name: :Tile, optional: true
  belongs_to :hand13, class_name: :Tile, optional: true
  belongs_to :tsumo, class_name: :Tile, optional: true
end
