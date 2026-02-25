import { API_BASE_URL } from "@/config/apiConfig";
import AuthVerificationForm from "@/src/app/auth/verification/_components/AuthVerificationForm";
import ErrorPage from "@/src/components/errors/ErrorPage";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export default async function AuthVerificationSection() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/status`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "認証状態の取得に失敗しました");
    }

    if (data.logged_in) redirect("/me");

    return <AuthVerificationForm />;
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    /* eslint-disable-next-line no-console */
    console.error("AuthVerificationSection error:", error);

    if (error instanceof Error) {
      return <ErrorPage message={error.message} />;
    }
  }
}
