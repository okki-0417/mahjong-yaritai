import { CurrentSessionDocument } from "@/src/generated/graphql";
import { getClient } from "@/src/lib/apollo/server";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export default async function Home() {
  const client = getClient();

  try {
    const sessionData = await client.query({ query: CurrentSessionDocument });

    if (sessionData.data.currentSession?.isLoggedIn) {
      redirect("/me");
    } else {
      redirect("/top");
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    /* eslint-disable-next-line no-console */
    console.error("Home page error:", error);
    redirect("/top");
  }
}
