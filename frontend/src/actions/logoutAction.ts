"use server";

import { API_BASE_URL } from "@/config/apiConfig";
import { ApiResult } from "@/src/types/apiResult";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function logoutAction(): Promise<ApiResult<null>> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      cookieStore.delete("access_token");
      cookieStore.delete("refresh_token");

      return {
        data: null,
        errors: null,
      };
    }

    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    if (!response.ok && response.status !== 204) {
      const data = await response.json().catch(() => ({}));
      return {
        data: null,
        errors: data.errors || ["ログアウトに失敗しました"],
      };
    }

    revalidatePath("/", "layout");

    return {
      data: null,
      errors: null,
    };
  } catch (error) {
    console.error("logoutAction error:", error);
    return {
      data: null,
      errors:
        error instanceof Error
          ? [error.message]
          : ["ログアウト中に予期せぬエラーが発生しました"],
    };
  }
}
