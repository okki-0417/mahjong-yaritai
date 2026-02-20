# frozen_string_literal: true

class WithdrawalSummarySerializer < ActiveModel::Serializer
  attributes :what_to_discard_problems_count

  def what_to_discard_problems_count
    object[:what_to_discard_problems_count]
  end
end
