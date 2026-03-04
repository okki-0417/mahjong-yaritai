"use server";

import { API_BASE_URL } from "@/config/apiConfig";
import { paths } from "@/src/types/api";
import { ApiResult } from "@/src/types/apiResult";
import { cookies } from "next/headers";

type LineLoginUrlResponse =
  paths["/auth/line/login_url"]["post"]["responses"]["201"]["content"]["application/json"];

export default async function getLineLoginUrlAction(): Promise<
  ApiResult<LineLoginUrlResponse | null>
> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/line/login_url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("LINEのログインURLの取得に失敗しました");
    }

    const data: LineLoginUrlResponse = await response.json();

    if (!data.login_url || !data.line_login_id) {
      throw new Error("LINEのログインURLの取得に失敗しました");
    }

    const cookieStore = await cookies();
    cookieStore.set("line_login_id", data.line_login_id, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/auth/line-callback",
    });

    return {
      data,
      errors: null,
    };
  } catch (error) {
    return {
      data: null,
      errors:
        error instanceof Error
          ? [error.message]
          : ["不明なエラーが発生しました"],
    };
  }
}
