class LearningCategorySerializer < ActiveModel::Serializer
  attributes %i[id name description created_at updated_at]
end
