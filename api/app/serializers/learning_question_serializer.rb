class LearningQuestionSerializer < ActiveModel::Serializer
  attributes %i[id statement answer created_at updated_at]

  belongs_to :category, serializer: LearningCategorySerializer
end
