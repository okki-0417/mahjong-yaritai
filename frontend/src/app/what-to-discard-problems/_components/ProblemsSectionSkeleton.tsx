import { Box, Flex, Skeleton, VStack } from "@chakra-ui/react";
import ProblemCardSkeleton from "@/src/components/fallbacks/ProblemCardSkeleton";

const MIN_PROBLEMS_DISPLAYED = 3;

export default function ProblemsSectionSkeleton() {
  return (
    <Box>
      <VStack gap={["8", "16"]}>
        {Array.from({ length: MIN_PROBLEMS_DISPLAYED }).map((_, index) => (
          <ProblemCardSkeleton key={index} />
        ))}
      </VStack>

      <Flex justify="center" mt={5}>
        <Skeleton height="40px" width="120px" borderRadius="md" />
      </Flex>
    </Box>
  );
}
