"use server";

import { API_BASE_URL } from "@/config/apiConfig";
import { components, paths } from "@/src/types/api";
import { ApiResult } from "@/src/types/apiResult";

export type FetchFollowersActionSuccessResponse =
  paths["/users/{user_id}/followers"]["get"]["responses"]["200"]["content"]["application/json"];
export type FetchFollowersActionErrorResponse = components["schemas"]["Errors"];
export type FetchFollowersActionUserItem = {
  id: number;
  name: string;
  avatar_url: string | null;
  profile_text: string | null;
};

export const fetchFollowersAction = async (
  userId: number,
): Promise<ApiResult<FetchFollowersActionUserItem[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/followers`);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorData = data as FetchFollowersActionErrorResponse;
      return {
        data: [],
        errors: errorData.errors || ["フォロワーの取得に失敗しました"],
      };
    }

    const successData = data as FetchFollowersActionSuccessResponse;
    return {
      data: successData.users,
      errors: null,
    };
  } catch (error) {
    console.error("fetchFollowersAction error:", error);
    return {
      data: [],
      errors:
        error instanceof Error
          ? [error.message]
          : ["フォロワーの取得中に予期せぬエラーが発生しました"],
    };
  }
};
