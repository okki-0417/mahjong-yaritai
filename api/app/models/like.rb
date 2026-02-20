# frozen_string_literal: true

class Like < ApplicationRecord
  belongs_to :user
  belongs_to :likable, polymorphic: true, counter_cache: true

  validates :user_id, uniqueness: { scope: %i[likable_type likable_id] }

  def liked_by?(user)
    user_id == user.id
  end
end
