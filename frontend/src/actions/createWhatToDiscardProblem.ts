"use server";

import { API_BASE_URL } from "@/config/apiConfig";
import { ApiError, WhatToDiscardProblem } from "@/src/types/components";
import { CreateWhatToDiscardProblemForm } from "@/src/types/forms";
import { cookies } from "next/headers";

export default async function createWhatToDiscardProblem({
  formData,
}: {
  formData: CreateWhatToDiscardProblemForm;
}): Promise<WhatToDiscardProblem> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const response = await fetch(`${API_BASE_URL}/what_to_discard_problems`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ what_to_discard_problem: formData }),
  });

  if (!response.ok) {
    const data: ApiError = await response.json();
    throw new Error(data.error || "問題の作成に失敗しました。");
  }

  const newProblem: WhatToDiscardProblem = await response.json();
  return newProblem;
}
