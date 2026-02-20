import AuthVerificationForm from "@/src/app/auth/verification/components/AuthVerificationForm";
import ErrorPage from "@/src/components/errors/ErrorPage";
import { CurrentUserProfileDocument } from "@/src/generated/graphql";
import { getClient } from "@/src/lib/apollo/server";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export default async function AuthVerificationSection() {
  const client = getClient();

  try {
    const { data } = await client.query({ query: CurrentUserProfileDocument });

    if (data?.currentSession?.isLoggedIn) redirect("/me");

    return <AuthVerificationForm />;
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    /* eslint-disable-next-line no-console */
    console.error("AuthVerificationSection error:", error);
    return <ErrorPage message={error.message} />;
  }
}
