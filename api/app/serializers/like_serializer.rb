# frozen_string_literal: true

class LikeSerializer < ActiveModel::Serializer
  attributes %i[
    id
    user_id
    likable_type
    likable_id
    created_at
    updated_at
  ]
end
