"use server";

import { API_BASE_URL } from "@/config/apiConfig";
import { ApiResult } from "@/src/types/apiResult";
import { FollowableUser } from "@/src/types/components";
import { cookies } from "next/headers";

const fetchUserAction = async (
  userId: number | string,
): Promise<ApiResult<FollowableUser | null>> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token");

    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken?.value}`,
      },
    });

    if (!response.ok) {
      throw new Error("ユーザーの取得に失敗しました。");
    }
    const data: FollowableUser | null = await response.json();

    return { data, errors: null };
  } catch (error) {
    console.error(error);

    return {
      data: null,
      errors: [error instanceof Error ? error.message : "不明なエラー"],
    };
  }
};

export default fetchUserAction;
