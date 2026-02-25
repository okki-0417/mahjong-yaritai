"use server";

import { API_BASE_URL } from "@/config/apiConfig";
import { ApiResult } from "@/src/types/apiResult";
import { cookies } from "next/headers";

export const followAction = async (
  targetUserId: number | string,
): Promise<ApiResult<null>> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return {
        data: null,
        errors: ["ログインが必要です"],
      };
    }

    const response = await fetch(`${API_BASE_URL}/me/followings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ target_user_id: targetUserId }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(
        data.errors?.[0] || data.error || "フォローに失敗しました",
      );
    }

    return {
      data: null,
      errors: null,
    };
  } catch (error) {
    console.error("followAction error:", error);

    return {
      data: null,
      errors:
        error instanceof Error
          ? [error.message]
          : ["フォロー中に予期せぬエラーが発生しました"],
    };
  }
};

export const unfollowAction = async (
  targetUserId: number | string,
): Promise<ApiResult<null>> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return {
        data: null,
        errors: ["ログインが必要です"],
      };
    }

    const response = await fetch(
      `${API_BASE_URL}/me/followings/${targetUserId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return {
        data: null,
        errors: [
          data.errors?.[0] || data.error || "フォローの解除に失敗しました",
        ],
      };
    }

    return {
      data: null,
      errors: null,
    };
  } catch (error) {
    console.error("unfollowAction error:", error);

    return {
      data: null,
      errors:
        error instanceof Error
          ? [error.message]
          : ["フォローの解除中に予期せぬエラーが発生しました"],
    };
  }
};
