import { Box, HStack, Skeleton, SkeletonCircle, VStack, Wrap } from "@chakra-ui/react";

export default function ProblemCardSkeleton() {
  return (
    <Box className="md:max-w-2xl w-screen px-1">
      {/* Timestamp skeleton */}
      <Skeleton height="16px" width="150px" mb="2" />

      <VStack borderRadius="md" shadow="md" alignItems="stretch" gap="0" overflow="hidden">
        <Box pt="2" px={["2", "4"]} pb="3" className="bg-mj-mat">
          {/* Header skeleton */}
          <HStack justify="space-between" mb="2">
            <HStack>
              <SkeletonCircle size="10" />
              <Skeleton height="20px" width="100px" />
            </HStack>
            <Skeleton height="20px" width="50px" />
          </HStack>

          {/* Round info skeleton with Wrap */}
          <Wrap mt="2" spacingY="0" align="center">
            <Skeleton height="24px" width="50px" />
            <Skeleton height="24px" width="60px" />
            <Skeleton height="24px" width="40px" />
            <Skeleton height="24px" width="80px" />
          </Wrap>

          {/* Hand tiles skeleton */}
          <HStack gap="1px" justify="center" alignItems="flex-end" mt="2">
            {Array.from({ length: 13 }).map((_, index) => (
              <Skeleton key={index} height="45px" width="35px" />
            ))}
          </HStack>

          {/* Description skeleton */}
          <Box mt="4">
            <Skeleton height="16px" width="100%" mb="1" />
          </Box>
        </Box>

        {/* Bottom action bar skeleton */}
        <HStack px={["2", "4"]} py={["1", "2"]} className="rounded-b-md bg-neutral">
          <Skeleton height="20px" width="60px" />
          <Skeleton height="20px" width="80px" />
          <Skeleton height="20px" width="100px" />
        </HStack>
      </VStack>
    </Box>
  );
}
