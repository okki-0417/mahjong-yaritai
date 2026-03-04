import { API_BASE_URL } from "@/config/apiConfig";
import { ApiError, WhatToDiscardProblem } from "@/src/types/components";

type Props = string | number;

export default async function fetchWhatToDiscardProblem(
  problem_id: Props,
): Promise<WhatToDiscardProblem> {
  const response = await fetch(
    `${API_BASE_URL}/what_to_discard_problems/${problem_id}`,
    { method: "GET" },
  );

  if (!response.ok) {
    const data: ApiError = await response.json();
    throw new Error(data.error || "Failed to fetch the problem.");
  }

  const data: WhatToDiscardProblem = await response.json();
  return data;
}
