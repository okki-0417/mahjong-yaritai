"use server";

import { API_BASE_URL } from "@/config/apiConfig";
import { paths } from "@/src/types/api";
import { ApiErrors } from "@/src/types/components";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type GoogleCallbackResponse =
  paths["/auth/google/callback"]["post"]["responses"]["201"]["content"]["application/json"];

const postGoogleCallbackAction = async (
  code: string,
): Promise<string | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/google/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const data: ApiErrors = await response.json();
      throw new Error(
        data.errors ? data.errors.join(", ") : "Google認証に失敗しました",
      );
    }

    const data: GoogleCallbackResponse = await response.json();
    const cookieStore = await cookies();

    if (data.encrypted_email) {
      cookieStore.set("email", data.encrypted_email, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/users/new",
      });

      redirect("/users/new");
    } else if (data.user_name && data.access_token && data.refresh_token) {
      cookieStore.set("access_token", data.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
      });

      cookieStore.set("refresh_token", data.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
      });

      redirect("/me");
    } else {
      throw new Error("Google認証のレスポンスが不正です");
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return error instanceof Error ? error.message : "Unknown error";
  }
};
export default postGoogleCallbackAction;
