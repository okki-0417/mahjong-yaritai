import SocialLoginSection from "@/src/app/auth/request/components/SocialLoginSection";
import AuthRequestForm from "@/src/app/auth/request/components/AuthRequestForm";
import { CurrentUserProfileDocument } from "@/src/generated/graphql";
import { getClient } from "@/src/lib/apollo/server";
import { redirect } from "next/navigation";
import ErrorPage from "@/src/components/errors/ErrorPage";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export default async function AuthRequestSection() {
  const client = getClient();

  try {
    const { data } = await client.query({ query: CurrentUserProfileDocument });

    if (data.currentSession.isLoggedIn) redirect("/me");

    return (
      <>
        <SocialLoginSection />
        <AuthRequestForm />
      </>
    );
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    /* eslint-disable-next-line no-console */
    console.error("AuthRequestSection error:", error);
    return <ErrorPage message={error.message} />;
  }
}
