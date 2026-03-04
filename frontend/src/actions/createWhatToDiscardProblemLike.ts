"use server";

import { API_BASE_URL } from "@/config/apiConfig";
import { ApiError, Like } from "@/src/types/components";
import { cookies } from "next/headers";

export default async function createWhatToDiscardProblemLike(
  problemId: number,
): Promise<Like> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    throw new Error("ログインしてください");
  }

  const response = await fetch(
    `${API_BASE_URL}/what_to_discard_problems/${problemId}/likes`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const data: ApiError = await response.json();
    throw new Error(data.error || "いいねの作成に失敗しました");
  }

  const data: Like = await response.json();
  return data;
}
