import SocialLoginSection from "@/src/app/auth/request/_components/SocialLoginSection";
import AuthRequestForm from "@/src/app/auth/request/_components/AuthRequestForm";
import { redirect } from "next/navigation";
import ErrorPage from "@/src/components/errors/ErrorPage";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies } from "next/headers";

export default async function AuthRequestSection() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (accessToken) {
      redirect("/me");
    }

    return (
      <>
        <SocialLoginSection />
        <AuthRequestForm />
      </>
    );
  } catch (error) {
    if (isRedirectError(error)) throw error;

    console.error("AuthRequestSection error:", error);

    if (error instanceof Error) {
      return <ErrorPage message={error.message} />;
    }
  }
}
