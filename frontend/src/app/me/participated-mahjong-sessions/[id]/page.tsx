import ParticipatedMahjongSessionSection from "@/src/app/me/participated-mahjong-sessions/[id]/components/ParticipatedMahjongSessionSection";
import Fallback from "@/src/components/fallbacks/Fallback";
import { Container } from "@chakra-ui/react";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ParticipatedMahjongSessionPage({ params }: Props) {
  const { id } = await params;

  return (
    <Container maxW="container.xl" px="0">
      <Suspense fallback={<Fallback />}>
        <ParticipatedMahjongSessionSection id={id} />
      </Suspense>
    </Container>
  );
}
