"use server";

import { API_BASE_URL } from "@/config/apiConfig";
import { components, paths } from "@/src/types/api";
import { ApiResult } from "@/src/types/apiResult";

export type FetchFollowingsActionSuccessResponse =
  paths["/users/{user_id}/followings"]["get"]["responses"]["200"]["content"]["application/json"];
export type FetchFollowingsActionErrorResponse =
  components["schemas"]["Errors"];
export type FetchFollowingsActionUserItem = {
  id: number;
  name: string;
  avatar_url: string | null;
  profile_text: string | null;
};

export const fetchFollowingsAction = async (
  userId: number,
): Promise<ApiResult<FetchFollowingsActionUserItem[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/followings`);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorData = data as FetchFollowingsActionErrorResponse;
      return {
        data: [],
        errors: errorData.errors || ["フォロー中ユーザーの取得に失敗しました"],
      };
    }

    const successData = data as FetchFollowingsActionSuccessResponse;
    return {
      data: successData.users,
      errors: null,
    };
  } catch (error) {
    console.error("fetchFollowingsAction error:", error);
    return {
      data: [],
      errors:
        error instanceof Error
          ? [error.message]
          : ["フォロー中ユーザーの取得中に予期せぬエラーが発生しました"],
    };
  }
};
