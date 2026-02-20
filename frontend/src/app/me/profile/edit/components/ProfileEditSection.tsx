import ProfileEditForm from "@/src/app/me/profile/edit/components/ProfileEditForm";
import ErrorPage from "@/src/components/errors/ErrorPage";
import { CurrentUserProfileDocument } from "@/src/generated/graphql";
import { getClient } from "@/src/lib/apollo/server";
import { Button, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { CiEdit } from "react-icons/ci";

export default async function ProfileEditSection() {
  const client = getClient();

  try {
    const { data: sessionData } = await client.query({
      query: CurrentUserProfileDocument,
    });

    if (sessionData.currentSession.isLoggedIn == false) redirect("/auth/request");

    const { data: userData } = await client.query({
      query: CurrentUserProfileDocument,
    });

    const user = userData.currentSession.user;

    return (
      <>
        <VStack gap="4" align="stretch">
          <Link href="/me/profile">
            <Button colorScheme="pink">
              <CiEdit size={20} />
            </Button>
          </Link>

          <ProfileEditForm user={user} />
        </VStack>
      </>
    );
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    /* eslint-disable-next-line no-console */
    console.error("ProfileEditSection error:", error);
    return <ErrorPage message={error.message} />;
  }
}
