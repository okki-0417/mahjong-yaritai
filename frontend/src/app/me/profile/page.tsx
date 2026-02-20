import UserProfileSkeleton from "@/src/components/fallbacks/UserProfileSkeleton";
import ProfileSection from "@/src/app/me/profile/components/ProfileSection";
import { Container } from "@chakra-ui/react";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function MeProfilePage() {
  return (
    <Container mt={["10", "12"]} maxW="lg" mb="20">
      <Suspense fallback={<UserProfileSkeleton />}>
        <ProfileSection />
      </Suspense>
    </Container>
  );
}
