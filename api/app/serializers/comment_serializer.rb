# frozen_string_literal: true

class CommentSerializer < ActiveModel::Serializer
  attributes %i[
    id
    user_id
    parent_comment_id
    replies_count
    commentable_type
    commentable_id
    content
    created_at
    updated_at
  ]

  belongs_to :user, serializer: UserSerializer
end
