"use server";

import { API_BASE_URL } from "@/config/apiConfig";
import { ApiError, Comment } from "@/src/types/components";
import { CreateWhatToDiscardProblemCommentForm } from "@/src/types/forms";
import { cookies } from "next/headers";

export default async function createWhatToDiscardProblemCommentAction({
  problemId,
  formData,
}: {
  problemId: number;
  formData: CreateWhatToDiscardProblemCommentForm;
}): Promise<Comment> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const response = await fetch(
    `${API_BASE_URL}/what_to_discard_problems/${problemId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ comment: formData }),
    },
  );

  if (!response.ok) {
    const data: ApiError = await response.json().catch(() => ({}));
    throw new Error(data.error || "コメントの投稿に失敗しました");
  }

  const data: Comment = await response.json();

  console.log("Created comment:", data);
  return data;
}
