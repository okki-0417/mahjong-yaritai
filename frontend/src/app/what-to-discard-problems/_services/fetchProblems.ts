import { cookies } from "next/headers";
import { API_BASE_URL } from "@/config/apiConfig";
import { User, WhatToDiscardProblemList } from "@/src/types/components";

type FetchProblemsResult = [
  problems: WhatToDiscardProblemList,
  me: User | null,
];

export async function fetchProblems(): Promise<FetchProblemsResult> {
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

  let me: User | null = null;

  if (accessToken) {
    const meResponse = await fetch(`${API_BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (meResponse.ok) {
      me = await meResponse.json();
    }
  }

  return [problems, me];
}
