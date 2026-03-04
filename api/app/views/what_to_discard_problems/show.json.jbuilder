# frozen_string_literal: true

json.partial! "problem",
  problem: @problem,
  my_like_ids_by_problem_id: @my_like_ids_by_problem_id,
  my_vote_tile_ids: @my_vote_tile_ids
