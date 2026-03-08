# frozen_string_literal: true

json.comments @comments do |comment|
  json.partial! "what_to_discard_problems/comments/comment", comment: comment
end
