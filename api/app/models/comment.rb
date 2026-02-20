# frozen_string_literal: true

class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :commentable,
              polymorphic: true,
              counter_cache: true
  belongs_to :parent_comment,
              class_name: :Comment,
              foreign_key: :parent_comment_id,
              optional: true,
              counter_cache: :replies_count
  has_many :replies,
            class_name: :Comment,
            foreign_key: :parent_comment_id,
            dependent: :destroy

  validates :content, presence: true, length: { maximum: 500 }
  validate :check_parent_comment_association

  scope :parents, -> { where(parent_comment_id: nil) }

  private

  def parent_comment?
    parent_comment_id.blank?
  end

  def check_parent_comment_association
    return if parent_comment?
    return if Comment.exists?(id: parent_comment_id)

    errors.add(:parent_comment_id, :missing_parent_comment)
  end
end
