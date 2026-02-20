import { Container, Divider, Skeleton, Box } from "@chakra-ui/react";

export default function TitleSkeleton() {
  return (
    <Container mt="20" maxW="4xl">
      <Skeleton height={["32px", "48px"]} width={["120px", "180px"]} mb="2" />
      <Divider />

      <Box mt="8">
        <Skeleton height="600px" borderRadius="md" />
      </Box>
    </Container>
  );
}
