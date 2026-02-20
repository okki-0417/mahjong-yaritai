import { Container } from "@chakra-ui/react";
import ProblemsSectionSkeleton from "@/src/app/what-to-discard-problems/components/ProblemsSectionSkeleton";

export default function Loading() {
  return (
    <Container mt={["6", "12"]} maxW="4xl" px={["3", "0"]}>
      <ProblemsSectionSkeleton />
    </Container>
  );
}
