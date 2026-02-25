"use server";

import { API_BASE_URL } from "@/config/apiConfig";
import { ApiResult } from "@/src/types/apiResult";
import { cookies } from "next/headers";

export type RequestActionFormInput = {
  email: string;
};

export type RequestActionResponse = {
  encrypted_email?: string | null;
  errors?: string[] | null;
};

export type RequestActionResult = {
  encrypted_email: string | null;
};

export const requestAction = async (
  formData: RequestActionFormInput,
): Promise<ApiResult<RequestActionResult>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ auth_request: formData }),
    });
    const data: RequestActionResponse = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        data: {
          encrypted_email: null,
        },
        errors: data.errors || ["認証リクエストの送信に失敗しました"],
      };
    }

    const encryptedEmail = data.encrypted_email;
    if (!encryptedEmail) {
      return {
        data: {
          encrypted_email: null,
        },
        errors: ["不正なレスポンスが返されました"],
      };
    }

    const cookieStore = await cookies();
    cookieStore.set("email", encryptedEmail, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 15,
      path: "/auth/verification",
    });

    return {
      data: {
        encrypted_email: encryptedEmail,
      },
      errors: null,
    };
  } catch (error) {
    console.error("requestAction error:", error);

    return {
      data: {
        encrypted_email: null,
      },
      errors:
        error instanceof Error
          ? [error.message]
          : ["認証リクエストの送信中に予期せぬエラーが発生しました"],
    };
  }
};
