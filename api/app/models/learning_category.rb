class LearningCategory < ApplicationRecord
  has_many :questions, class_name: :LearningQuestion, foreign_key: :learning_category_id, dependent: :destroy

  validates :name, presence: true
  validates :description, presence: true
end
