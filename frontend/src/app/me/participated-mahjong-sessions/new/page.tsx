import ParticipatedMahjongSessionForm from "@/src/app/me/participated-mahjong-sessions/new/components/ParticipatedMahjongSessionForm";
import MahjongSessionFormContextProvider from "@/src/app/me/participated-mahjong-sessions/new/contexts/MahjongSessionFormContextProvider";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Container } from "@chakra-ui/react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function NewGameRecordPage() {
  return (
    <Container maxW="container.xl" py="2" px="1">
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} href="/me">
            マイページ
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink as={Link} href="/me/participated-mahjong-sessions">
            麻雀戦績
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink isCurrentPage>新しい戦績</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <MahjongSessionFormContextProvider>
        <ParticipatedMahjongSessionForm />
      </MahjongSessionFormContextProvider>
    </Container>
  );
}
