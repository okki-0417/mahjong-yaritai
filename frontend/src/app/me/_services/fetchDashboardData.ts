import { cookies } from "next/headers";
import { API_BASE_URL } from "@/config/apiConfig";
import { paths } from "@/src/types/api";
import {
  type ApiError,
  type FollowStats,
  type User,
} from "@/src/types/components";

type MeApiResponse =
  paths["/me"]["get"]["responses"]["200"]["content"]["application/json"];
type FollowStatsApiResponse =
  paths["/users/{user_id}/follow_stats"]["get"]["responses"]["200"]["content"]["application/json"];

export async function fetchDashboardData(): Promise<[User, FollowStats]> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    throw new Error("認証情報が取得できませんでした");
  }

  const meResponse = await fetch(`${API_BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!meResponse.ok) {
    const data: ApiError = await meResponse.json();
    throw new Error(
      data.errors?.join(", ") || "ユーザ情報の取得に失敗しました",
    );
  }

  const me: MeApiResponse = await meResponse.json();

  const followStatsResponse = await fetch(
    `${API_BASE_URL}/users/${me.id}/follow_stats`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  if (!followStatsResponse.ok) {
    const data: ApiError = await followStatsResponse.json();
    throw new Error(
      data.errors?.join(", ") || "フォロー・フォロワー数の取得に失敗しました",
    );
  }

  const followStats: FollowStatsApiResponse = await followStatsResponse.json();

  return [me, followStats];
}
