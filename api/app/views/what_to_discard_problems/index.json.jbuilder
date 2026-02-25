# frozen_string_literal: true

json.problems @problems do |problem|
  json.id problem.id
  json.hand1_id problem.hand1_id
  json.hand2_id problem.hand2_id
  json.hand3_id problem.hand3_id
  json.hand4_id problem.hand4_id
  json.hand5_id problem.hand5_id
  json.hand6_id problem.hand6_id
  json.hand7_id problem.hand7_id
  json.hand8_id problem.hand8_id
  json.hand9_id problem.hand9_id
  json.hand10_id problem.hand10_id
  json.hand11_id problem.hand11_id
  json.hand12_id problem.hand12_id
  json.hand13_id problem.hand13_id
  json.tsumo_id problem.tsumo_id
  json.dora_id problem.dora_id
  json.round problem.round
  json.turn problem.turn
  json.wind problem.wind
  json.points problem.points
  json.description problem.description
  json.comments_count problem.comments_count
  json.likes_count problem.likes_count
  json.votes_count problem.votes_count
  json.is_liked_by_me @liked_problem_ids.include?(problem.id)
  json.my_vote_tile_id @my_vote_tile_ids[problem.id]
  json.created_at problem.created_at.iso8601

  json.user do
    json.id problem.user.id
    json.name problem.user.name
    json.avatar_url problem.user.avatar_url
    json.profile_text problem.user.profile_text
  end
end

json.page_info do
  json.has_next_page @page_info[:has_next_page]
  json.has_previous_page @page_info[:has_previous_page]
  json.start_cursor @page_info[:start_cursor]
  json.end_cursor @page_info[:end_cursor]
end
