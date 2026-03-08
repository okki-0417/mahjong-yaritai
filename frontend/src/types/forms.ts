import { paths } from "@/src/types/api";

export type EditWhatToDiscardProblemForm =
  paths["/what_to_discard_problems/{id}"]["put"]["requestBody"]["content"]["application/json"];
export type CreateWhatToDiscardProblemCommentForm =
  paths["/what_to_discard_problems/{what_to_discard_problem_id}/comments"]["post"]["requestBody"]["content"]["application/json"]["comment"];
export type CreateWhatToDiscardProblemForm =
  paths["/what_to_discard_problems"]["post"]["requestBody"]["content"]["application/json"];
export type UpdateWhatToDiscardProblemForm =
  paths["/what_to_discard_problems/{id}"]["put"]["requestBody"]["content"]["application/json"];
