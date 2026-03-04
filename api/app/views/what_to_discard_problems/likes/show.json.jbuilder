# frozen_string_literal: true

json.id @like.id
json.user_id @like.user_id
json.likable_id @like.likable_id
json.likable_type @like.likable_type
json.created_at @like.created_at.iso8601
