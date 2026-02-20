import UserProfileSkeleton from "@/src/components/fallbacks/UserProfileSkeleton";
import ProfileEditSection from "@/src/app/me/profile/edit/components/ProfileEditSection";
import { Suspense } from "react";
import { Container } from "@chakra-ui/react";

export const dynamic = "force-dynamic";

export default function ProfileEdit() {
  return (
    <Container mt={["10", "12"]} maxW="lg" mb="20">
      <Suspense fallback={<UserProfileSkeleton />}>
        <ProfileEditSection />
      </Suspense>
    </Container>
  );
}
