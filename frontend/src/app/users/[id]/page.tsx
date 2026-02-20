import UserProfileSkeleton from "@/src/components/fallbacks/UserProfileSkeleton";
import UserProfileSection from "@/src/app/users/[id]/components/UserProfileSection";
import { Container } from "@chakra-ui/react";
import { Suspense } from "react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UserShow({ params }: Props) {
  const { id } = await params;

  return (
    <Container mt={["10", "12"]} maxW="lg" mb="20">
      <Suspense fallback={<UserProfileSkeleton />}>
        <UserProfileSection id={id} />
      </Suspense>
    </Container>
  );
}
