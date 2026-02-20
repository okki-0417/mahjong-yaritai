import { Center, Spinner, Text, VStack } from "@chakra-ui/react";

export default function Fallback() {
  return (
    <VStack justify="stretch" align="stretch" h="full" w="full">
      <Center h="full">
        <VStack>
          <Spinner color="green.400" thickness="4px" emptyColor="gray.100" size="xl" />
          <Text fontSize="xl">Loading...</Text>
        </VStack>
      </Center>
    </VStack>
  );
}
