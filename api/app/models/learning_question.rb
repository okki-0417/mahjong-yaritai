class LearningQuestion < ApplicationRecord
  belongs_to :category, class_name: :LearningCategory, foreign_key: :learning_category_id

  validates :statement, presence: true
  validates :answer, presence: true
end
