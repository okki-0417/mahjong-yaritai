import UserProfile from "@/src/components/UserProfile";
import { UserProfileDocument } from "@/src/generated/graphql";
import ErrorPage from "@/src/components/errors/ErrorPage";
import { getClient } from "@/src/lib/apollo/server";

export default async function UserProfileSection({ id }: { id: string }) {
  const client = getClient();

  try {
    const { data } = await client.query({
      query: UserProfileDocument,
      variables: { userId: id },
    });

    return <UserProfile user={data.user} />;
  } catch (error) {
    /* eslint-disable-next-line no-console */
    console.error("UserProfileSection error:", error);
    return <ErrorPage message={error.message} />;
  }
}
