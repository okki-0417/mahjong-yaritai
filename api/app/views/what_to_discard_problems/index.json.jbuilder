# frozen_string_literal: true

json.problems @problems do |problem|
  json.partial! "problem",
    problem: problem,
    my_like_ids_by_problem_id: @my_like_ids_by_problem_id,
    my_vote_tile_ids: @my_vote_tile_ids
end

json.page_info do
  json.has_next_page @page_info[:has_next_page]
  json.has_previous_page @page_info[:has_previous_page]
  json.start_cursor @page_info[:start_cursor]
  json.end_cursor @page_info[:end_cursor]
end
