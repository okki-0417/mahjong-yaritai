"use server";

import { API_BASE_URL } from "@/config/apiConfig";
import { components, paths } from "@/src/types/api";
import { ApiResult } from "@/src/types/apiResult";
import { cookies } from "next/headers";

export type FetchMeActionSuccessResponse =
  paths["/me"]["get"]["responses"]["200"]["content"]["application/json"];
export type FetchMeActionErrorResponse = components["schemas"]["Errors"];

export const fetchMeAction = async (): Promise<
  ApiResult<FetchMeActionSuccessResponse | null>
> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return {
        data: null,
        errors: ["認証が必要です"],
      };
    }

    const response = await fetch(`${API_BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorData = data as FetchMeActionErrorResponse;
      return {
        data: null,
        errors: errorData.errors || ["ユーザー情報の取得に失敗しました"],
      };
    }

    return {
      data: data as FetchMeActionSuccessResponse,
      errors: null,
    };
  } catch (error) {
    console.error("fetchMeAction error:", error);
    return {
      data: null,
      errors:
        error instanceof Error
          ? [error.message]
          : ["ユーザー情報の取得中に予期せぬエラーが発生しました"],
    };
  }
};
