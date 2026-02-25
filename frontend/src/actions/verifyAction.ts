"use server";

import { API_BASE_URL } from "@/config/apiConfig";
import { ApiResult } from "@/src/types/apiResult";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type VerifyActionFormData = {
  token: string;
};

export type VerifyActionResponse = {
  user_name?: string | null;
  access_token?: string | null;
  refresh_token?: string | null;
  encrypted_auth_request_id?: string | null;
  errors?: string[] | null;
};

export type VerifyActionResult = {
  user_name: string | null;
};

export async function verifyAction(
  formData: VerifyActionFormData,
): Promise<ApiResult<VerifyActionResult>> {
  try {
    const cookieStore = await cookies();
    const encryptedEmail = cookieStore.get("email")?.value;

    if (!encryptedEmail) {
      return {
        data: {
          user_name: null,
        },
        errors: [
          "認証に必要な情報が不足しています。再度ログインをお試しください。",
        ],
      };
    }

    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_verify: { ...formData, encrypted_email: encryptedEmail },
      }),
    });

    const data: VerifyActionResponse = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        data: {
          user_name: null,
        },
        errors: data.errors || ["認証検証の送信に失敗しました"],
      };
    }

    if (data.encrypted_auth_request_id) {
      cookieStore.set("auth_request_id", data.encrypted_auth_request_id, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 15,
        path: "/auth/verification",
      });

      redirect("/users/new");
    } else if (data.access_token && data.refresh_token) {
      cookieStore.set("access_token", data.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60,
      });

      cookieStore.set("refresh_token", data.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
      });

      cookieStore.delete("email");
      revalidatePath("/", "layout");
    }

    return {
      data: {
        user_name: data.user_name || null,
      },
      errors: null,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;

    console.error("verifyAction error:", error);
    return {
      data: {
        user_name: null,
      },
      errors:
        error instanceof Error
          ? [error.message]
          : ["認証検証の送信中に予期せぬエラーが発生しました"],
    };
  }
}
