import { API_BASE_URL } from "@/config/apiConfig";
import { getWhatToDiscardProblemRepliesResponse } from "@/src/types/actions";
import { ApiError, Comment } from "@/src/types/components";

type Props = {
  problemId: number;
  commentId: number;
};

export default async function getWhatToDiscardProblemReplies({
  problemId,
  commentId,
}: Props): Promise<Comment[]> {
  const response = await fetch(
    `${API_BASE_URL}/what_to_discard_problems/${problemId}/comments/${commentId}/replies`,
  );

  if (!response.ok) {
    const data: ApiError = await response.json();
    throw new Error(data.error || "返信の取得に失敗しました");
  }

  const data: getWhatToDiscardProblemRepliesResponse = await response.json();

  return data.comments;
}
