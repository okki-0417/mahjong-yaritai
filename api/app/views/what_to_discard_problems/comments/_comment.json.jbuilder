# frozen_string_literal: true

json.id comment.id
json.content comment.content
json.parent_comment_id comment.parent_comment_id
json.commentable_type comment.commentable_type
json.commentable_id comment.commentable_id
json.replies_count comment.replies_count
json.created_at comment.created_at.iso8601
json.user do
  json.id comment.user.id
  json.name comment.user.name
  json.avatar_url comment.user.avatar_url
  json.profile_text comment.user.profile_text
end
