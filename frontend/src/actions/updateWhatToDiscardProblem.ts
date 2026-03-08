"use server";

import { API_BASE_URL } from "@/config/apiConfig";
import { ApiError, WhatToDiscardProblem } from "@/src/types/components";
import { EditWhatToDiscardProblemForm } from "@/src/types/forms";
import { cookies } from "next/headers";

type Props = {
  id: number;
  form: EditWhatToDiscardProblemForm;
};

export default async function updateWhatToDiscardProblem({
  id,
  form,
}: Props): Promise<WhatToDiscardProblem> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const response = await fetch(
    `${API_BASE_URL}/what_to_discard_problems/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ what_to_discard_problem: form }),
    },
  );

  if (!response.ok) {
    const data: ApiError = await response.json().catch(() => ({}));
    throw new Error(data.error || "問題の更新に失敗しました");
  }

  const data: WhatToDiscardProblem = await response.json();

  return data;
}
