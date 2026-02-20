import VotedWhatToDiscardProblemsSection from "@/src/app/me/what-to-discard-problems/voted/components/VotedWhatToDiscardProblemsSection";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Container } from "@chakra-ui/react";
import Link from "next/link";
import { Suspense } from "react";

export default function VotedWhatToDiscardProblemsPage() {
  return (
    <>
      <Container mt="4" maxW="container.xl" px="1">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} href="/me">
              マイページ
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink isCurrentPage>投票した何切る問題</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Container mt="4" maxW="container.lg">
          <Suspense>
            <VotedWhatToDiscardProblemsSection />
          </Suspense>
        </Container>
      </Container>
    </>
  );
}
