"use server";

import { API_BASE_URL } from "@/config/apiConfig";
import { ApiError } from "@/src/types/components";
import { cookies } from "next/headers";

type Props = {
  problemId: number;
  likeId: number;
};

export default async function deleteWhatToDiscardProblemLike({
  problemId,
  likeId,
}: Props): Promise<null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    throw new Error("ログインしてください");
  }

  const response = await fetch(
    `${API_BASE_URL}/what_to_discard_problems/${problemId}/likes/${likeId}/`,
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
    throw new Error(data.error || "Failed to delete the like");
  }

  return null;
}
