import { paths } from "@/src/types/api";

export type getWhatToDiscardProblemRepliesResponse =
  paths["/what_to_discard_problems/{what_to_discard_problem_id}/comments/{comment_id}/replies"]["get"]["responses"]["200"]["content"]["application/json"];
