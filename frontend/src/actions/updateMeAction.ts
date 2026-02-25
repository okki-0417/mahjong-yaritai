"use server";

import { API_BASE_URL } from "@/config/apiConfig";
import { components, paths } from "@/src/types/api";
import { ApiResult } from "@/src/types/apiResult";
import { cookies } from "next/headers";

export type UpdateMeActionSuccessResponse =
  paths["/me"]["get"]["responses"]["200"]["content"]["application/json"];
export type UpdateMeActionErrorResponse = components["schemas"]["Errors"];

export const updateMeAction = async (
  formData: FormData,
): Promise<ApiResult<UpdateMeActionSuccessResponse | null>> => {
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
      method: "PATCH",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorData = data as UpdateMeActionErrorResponse;
      return {
        data: null,
        errors: errorData.errors || ["プロフィールの更新に失敗しました"],
      };
    }

    return {
      data: data as UpdateMeActionSuccessResponse,
      errors: null,
    };
  } catch (error) {
    console.error("updateMeAction error:", error);
    return {
      data: null,
      errors:
        error instanceof Error
          ? [error.message]
          : ["プロフィールの更新中に予期せぬエラーが発生しました"],
    };
  }
};
