"use server";

import { API_BASE_URL } from "@/config/apiConfig";
import { paths } from "@/src/types/api";
import { ApiError } from "@/src/types/components";
import { cookies } from "next/headers";

type Props = {
  problemId: number | string;
};

type DeleteWhatToDiscardProblemResponse =
  paths["/what_to_discard_problems/{id}"]["delete"]["responses"]["204"]["content"];

export default async function deleteWhatToDiscardProblem({
  problemId,
}: Props): Promise<null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const response = await fetch(
    `${API_BASE_URL}/what_to_discard_problems/${problemId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    const data: ApiError = await response.json();

    throw new Error(data.error ? data.error : "削除に失敗しました");
  }

  return null;
}
