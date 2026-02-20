import { Container, Divider, Text, VStack } from "@chakra-ui/react";
import { Suspense } from "react";
import Fallback from "@/src/components/fallbacks/Fallback";
import AuthRequestSection from "@/src/app/auth/request/components/AuthRequestSection";

export const dynamic = "force-dynamic";

export default function AuthRequest() {
  return (
    <Container mt="12" maxW="2xl">
      <Text fontSize={["2xl", "4xl"]} fontWeight="bold">
        認証リクエスト
      </Text>
      <Divider />

      <VStack mt="8" gap="12" w="full" align="stretch">
        <Suspense fallback={<Fallback />}>
          <AuthRequestSection />
        </Suspense>
      </VStack>
    </Container>
  );
}
