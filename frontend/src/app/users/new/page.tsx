import { Box, Container, Divider, Text } from "@chakra-ui/react";
import UserCreateSection from "@/src/app/users/new/components/UserCreateSection";
import { Suspense } from "react";
import Fallback from "@/src/components/fallbacks/Fallback";

export const dynamic = "force-dynamic";

export default function UserCreate() {
  return (
    <Container mt={["8", "20"]} size="xl">
      <Text as="h1" fontSize={["2xl", "4xl"]} fontWeight="bold">
        新規ユーザー登録
      </Text>
      <Divider />

      <Box mt="8">
        <Suspense fallback={<Fallback />}>
          <UserCreateSection />
        </Suspense>
      </Box>
    </Container>
  );
}
