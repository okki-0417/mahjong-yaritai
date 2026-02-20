import UserForm from "@/src/app/users/new/components/UserForm";
import ErrorPage from "@/src/components/errors/ErrorPage";
import { CurrentSessionDocument } from "@/src/generated/graphql";
import { getClient } from "@/src/lib/apollo/server";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export default async function UserCreateSection() {
  const client = getClient();

  try {
    const { data } = await client.query({
      query: CurrentSessionDocument,
    });

    if (data.currentSession.isLoggedIn) redirect("/dashboard");

    return <UserForm />;
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    /* eslint-disable-next-line no-console */
    console.error("UserCreateSection error:", error);
    return <ErrorPage message={error.message} />;
  }
}
