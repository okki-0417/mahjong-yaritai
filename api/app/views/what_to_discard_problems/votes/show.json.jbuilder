# frozen_string_literal: true

json.id @vote.id
json.user_id @vote.user_id
json.what_to_discard_problem_id @vote.what_to_discard_problem_id
json.tile_id @vote.tile_id
json.created_at @vote.created_at.iso8601
