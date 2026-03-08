"use server";

import { API_BASE_URL } from "@/config/apiConfig";
import { ApiError } from "@/src/types/components";
import { cookies } from "next/headers";

type Props = {
  problemId: number;
  voteId: number;
};

export default async function deleteVoteAction({
  problemId,
  voteId,
}: Props): Promise<null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    throw new Error("ログインしてください");
  }

  const response = await fetch(
    `${API_BASE_URL}/what_to_discard_problems/${problemId}/votes/${voteId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    const data: ApiError = await response.json();
    throw new Error(data.error || "投票の削除に失敗しました");
  }

  return null;
}
