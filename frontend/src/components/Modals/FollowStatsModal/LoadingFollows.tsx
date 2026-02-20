import { HStack, Spinner } from "@chakra-ui/react";

export default function LoadingFollows() {
  return (
    <HStack justify="center">
      <Spinner size="md" />
    </HStack>
  );
}
