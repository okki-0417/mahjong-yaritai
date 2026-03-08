import { cookies } from "next/headers";
import { API_BASE_URL } from "@/config/apiConfig";
import { WhatToDiscardProblemList } from "@/src/types/components";

export async function fetchProblems(): Promise<WhatToDiscardProblemList> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const problemsResponse = await fetch(
    `${API_BASE_URL}/what_to_discard_problems`,
    {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
  );
  if (!problemsResponse.ok) {
    throw new Error("問題の取得に失敗しました。");
  }

  const problems: WhatToDiscardProblemList = await problemsResponse.json();

  return problems;
}
