import ParticipatedMahjongSessionsSection from "@/src/app/me/participated-mahjong-sessions/components/ParticipatedMahjongSessionsSection";
import Fallback from "@/src/components/fallbacks/Fallback";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Container,
  HStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { Suspense } from "react";
import { FaPlus } from "react-icons/fa6";

export const dynamic = "force-dynamic";

export default function GameRecordsPage() {
  return (
    <Container maxW="container.xl" py={4} px="0">
      <Box px="2">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/me">マイページ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink isCurrentPage>麻雀戦績</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>

      <Container mt="4" maxW="container.md" px="1">
        <HStack justifyContent="end" mb="4">
          <Button
            colorScheme="pink"
            leftIcon={<FaPlus />}
            as={Link}
            href="/me/participated-mahjong-sessions/new">
            新しい戦績を追加する
          </Button>
        </HStack>

        <Suspense fallback={<Fallback />}>
          <ParticipatedMahjongSessionsSection />
        </Suspense>
      </Container>
    </Container>
  );
}
