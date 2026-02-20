import { Box, Container, Divider, Skeleton, SkeletonText, VStack } from "@chakra-ui/react";

export default function TitleDescSkeleton() {
  return (
    <Container mt="20" maxW="4xl" px={["3", "0"]}>
      <VStack gap="4" alignItems="stretch">
        <Box>
          <Skeleton height={["32px", "48px"]} width={["150px", "200px"]} mb="2" />
          <Divider />
        </Box>

        <SkeletonText noOfLines={3} spacing="4" skeletonHeight="20px" />
      </VStack>
    </Container>
  );
}
