import { Alert, AlertDescription, AlertIcon, AlertTitle, Container, Text } from "@chakra-ui/react";

type Props = {
  message: string;
};

export default function ErrorPage({ message }: Props) {
  const errorMessage = message || "不明なエラーが発生しました。";

  return (
    <Container mt="20" maxW="2xl" mb="20">
      <Alert
        status="error"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px">
        <AlertIcon boxSize="40px" mr={0} />

        <AlertTitle mt={4} mb={1} fontSize="lg">
          <Text color="red.700">エラーが発生しました</Text>
        </AlertTitle>

        <AlertDescription mt="2">
          <Text color="red.700">{errorMessage}</Text>
        </AlertDescription>
      </Alert>
    </Container>
  );
}
