import { Container, Skeleton, SkeletonText, SkeletonCircle, HStack } from "@chakra-ui/react";

export default function UserProfileSkeleton() {
  return (
    <Container maxW="lg" px="0">
      <HStack justify="center" mt={["10", "12"]} w="full">
        <SkeletonCircle size={["150", "200"]} />
      </HStack>

      <Skeleton height="32px" width="200px" mx="auto" mt="4" />

      <SkeletonText w="full" noOfLines={3} spacing="4" skeletonHeight="20px" mt="4" />
    </Container>
  );
}
