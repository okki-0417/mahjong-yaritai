"use server";

import { API_BASE_URL } from "@/config/apiConfig";
import { ApiError, Vote } from "@/src/types/components";
import { cookies } from "next/headers";

type Props = {
  problemId: number;
  tileId: number;
};

export default async function createVoteAction({
  problemId,
  tileId,
}: Props): Promise<Vote> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    throw new Error("ログインしてください");
  }

  const response = await fetch(
    `${API_BASE_URL}/what_to_discard_problems/${problemId}/votes`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tile_id: tileId }),
    },
  );

  if (!response.ok) {
    const data: ApiError = await response.json();
    throw new Error(data.error || "投票の作成に失敗しました");
  }

  const data: Vote = await response.json();
  return data;
}
