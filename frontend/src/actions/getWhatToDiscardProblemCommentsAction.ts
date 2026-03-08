"use server";

import { API_BASE_URL } from "@/config/apiConfig";
import { ApiError, Comment } from "@/src/types/components";

export default async function getWhatToDiscardProblemCommentsAction(
  problemId: number,
): Promise<Comment[]> {
  const response = await fetch(
    `${API_BASE_URL}/what_to_discard_problems/${problemId}/comments`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const data: ApiError = await response.json().catch(() => ({}));
    throw new Error(data.error || "コメントの取得に失敗しました");
  }

  const data: { comments: Comment[] } = await response.json();

  return data.comments;
}
