import ErrorPage from "@/src/components/errors/ErrorPage";
import {
  CurrentSessionDocument,
  ParticipatedMahjongSessionDocument,
} from "@/src/generated/graphql";
import { getClient } from "@/src/lib/apollo/server";
import {
  Avatar,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Center,
  Container,
  Divider,
  HStack,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { captureException } from "@sentry/nextjs";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

type Props = {
  id: string;
};

export default async function ParticipatedMahjongSessionSection({ id }: Props) {
  const client = getClient();

  try {
    const { data: sessionData } = await client.query({
      query: CurrentSessionDocument,
    });

    if (sessionData.currentSession.isLoggedIn == false) {
      redirect("/auth/request");
    }

    const { data, error } = await client.query({
      query: ParticipatedMahjongSessionDocument,
      variables: { id },
    });

    if (error) {
      throw new Error(error.message);
    }

    const mahjongSession = data.participatedMahjongSession;

    return (
      <Box>
        <Container maxW="container.xl" mb="4" px="1" mt="2">
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/me">マイページ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/me/participated-mahjong-sessions">麻雀戦績</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink isCurrentPage>
                {new Date(mahjongSession.createdAt).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Container>

        <Container px="0" maxW="container.md" mt="2">
          <Box px="1">
            <Text fontSize={["2xl", "3xl"]}>
              {new Date(mahjongSession.createdAt).toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>

            <HStack mb="1" gap="4">
              <HStack align="baseline" gap="1">
                <Text as="span" fontSize={["xs", "sm"]}>
                  レート
                </Text>
                <Text as="span" fontSize={["lg", "xl"]}>
                  {mahjongSession.mahjongScoringSetting.rate}
                </Text>
                <Text as="span" fontSize={["xs", "sm"]}>
                  pt
                </Text>
              </HStack>

              <HStack align="baseline" gap="1">
                <Text as="span" fontSize={["xs", "sm"]}>
                  チップ
                </Text>
                <Text as="span" fontSize={["lg", "xl"]}>
                  {mahjongSession.mahjongScoringSetting.chipAmount}
                </Text>
                <Text as="span" fontSize={["xs", "sm"]}>
                  pt
                </Text>
              </HStack>
            </HStack>
          </Box>

          <Table
            as="div"
            borderRadius={["sm", "md"]}
            bg="neutral.100"
            boxShadow="lg"
            overflow="hidden">
            <Thead as="div">
              <HStack gap="0" align="stretch">
                <Th
                  as="div"
                  px="0"
                  w={["10", "16"]}
                  borderColor="secondary.50"
                  borderBottom=""
                  borderRightWidth="1.5px"
                />

                <SimpleGrid as="div" columns={mahjongSession.mahjongParticipants.length} w="full">
                  {mahjongSession.mahjongParticipants.map(participant => (
                    <Th
                      as="div"
                      key={participant.id}
                      textAlign="center"
                      m="0"
                      px="1"
                      py="2"
                      w="full"
                      borderColor="secondary.50"
                      borderBottom=""
                      _even={{ bg: "neutral.300" }}>
                      <VStack spacing="2" w="full">
                        <Avatar
                          size={["sm", "md"]}
                          name={participant.user.name}
                          src={participant.user.avatarUrl}
                        />
                        <Text
                          fontSize={["sm", "md"]}
                          fontWeight="bold"
                          noOfLines={1}
                          color="primary.500"
                          overflow="hidden"
                          whiteSpace="nowrap"
                          w="full"
                          textTransform="none"
                          textOverflow="ellipsis">
                          {participant.name}
                        </Text>
                      </VStack>
                    </Th>
                  ))}
                </SimpleGrid>
              </HStack>
            </Thead>

            <Divider borderWidth="2px" borderColor="#060" />

            <Tbody
              as={VStack}
              align="stretch"
              spacing="0"
              divider={<Divider borderColor="secondary.50" borderBottomWidth="1.5px" />}>
              {mahjongSession.mahjongGames.map((game, gameIndex) => (
                <Tr as={HStack} gap="0" key={game.id} align="stretch" borderBottom="0">
                  <Th
                    key={game.id}
                    as={VStack}
                    px="0"
                    py="4"
                    w={["10", "16"]}
                    fontSize={["md", "xl"]}
                    borderBottom=""
                    color="primary.500"
                    borderColor="secondary.50"
                    borderRightWidth="1.5px">
                    <Text>{gameIndex + 1}</Text>
                  </Th>

                  <SimpleGrid
                    as="div"
                    columns={mahjongSession.mahjongParticipants.length}
                    w="full"
                    alignItems="stretch">
                    {mahjongSession.mahjongParticipants.map(participant => {
                      const participantResult = game.mahjongResults.find(
                        result => result.mahjongParticipantId === participant.id,
                      );

                      return (
                        <Td
                          as={VStack}
                          key={participant.id}
                          px="1"
                          py="2"
                          borderBottom=""
                          justify="center"
                          _even={{ bg: "neutral.300" }}>
                          <Text
                            fontWeight="bold"
                            fontSize={["xl", "2xl"]}
                            color={
                              participantResult?.resultPoints > 0
                                ? "blue.500"
                                : participantResult?.resultPoints < 0
                                  ? "red.500"
                                  : "inherit"
                            }>
                            {participantResult?.resultPoints}
                          </Text>
                        </Td>
                      );
                    })}
                  </SimpleGrid>
                </Tr>
              ))}
            </Tbody>

            <Divider borderWidth="2px" borderColor="#060" />

            <Tfoot as="div">
              <Tr as={HStack} gap="0" align="stretch">
                <Th
                  as={Center}
                  p="0"
                  w={["10", "16"]}
                  borderColor="secondary.50"
                  borderBottom=""
                  borderRightWidth="1.5px"
                  color="primary.500"
                  fontSize={["xs", "sm"]}>
                  <Text>合計</Text>
                </Th>

                <SimpleGrid as="div" columns={mahjongSession.mahjongParticipants.length} w="full">
                  {mahjongSession.mahjongParticipants.map(participant => (
                    <Td
                      as={VStack}
                      key={participant.id}
                      px="1"
                      py="4"
                      w="full"
                      borderBottom=""
                      _even={{ bg: "neutral.300" }}>
                      <Text
                        fontWeight="bold"
                        fontSize={["xl", "2xl"]}
                        color={
                          participant.totalPoints > 0
                            ? "blue.500"
                            : participant.totalPoints < 0
                              ? "red.500"
                              : "inherit"
                        }>
                        {participant.totalPoints}
                      </Text>
                    </Td>
                  ))}
                </SimpleGrid>
              </Tr>

              <Divider borderColor="secondary.50" />

              <Tr as={HStack} gap="0" align="stretch">
                <Th
                  as={Center}
                  px="0"
                  w={["10", "16"]}
                  py="0"
                  borderBottom=""
                  borderColor="secondary.50"
                  color="primary.500"
                  borderRightWidth="1.5px">
                  <Text fontSize={["xs", "sm"]}>
                    平均
                    <br />
                    順位
                  </Text>
                </Th>

                <SimpleGrid as="div" columns={mahjongSession.mahjongParticipants.length} w="full">
                  {mahjongSession.mahjongParticipants.map(participant => (
                    <Td
                      as={VStack}
                      key={participant.id}
                      textAlign="center"
                      px="1"
                      py="4"
                      fontSize={["lg", "xl"]}
                      borderBottom=""
                      _even={{ bg: "neutral.300" }}>
                      <Text fontSize={["xl", "2xl"]}>{participant.averageRanking}</Text>
                    </Td>
                  ))}
                </SimpleGrid>
              </Tr>

              <Divider borderColor="secondary.50" />

              <Tr as={HStack} gap="0" align="stretch">
                <Th
                  as={Center}
                  px="0"
                  w={["10", "16"]}
                  py="4"
                  borderBottom=""
                  borderColor="secondary.50"
                  color="primary.500"
                  borderRightWidth="1.5px">
                  <Text fontSize={["xs", "sm"]}>収支</Text>
                </Th>

                <SimpleGrid as="div" columns={mahjongSession.mahjongParticipants.length} w="full">
                  {mahjongSession.mahjongParticipants.map(participant => (
                    <Td
                      as={VStack}
                      key={participant.id}
                      px="1"
                      py="4"
                      borderBottom=""
                      _even={{ bg: "neutral.300" }}>
                      <Text
                        fontSize={["xl", "2xl"]}
                        fontWeight="bold"
                        color={
                          participant.totalProfits > 0
                            ? "blue.500"
                            : participant.totalProfits < 0
                              ? "red.500"
                              : "inherit"
                        }>
                        {participant.totalProfits}
                      </Text>
                    </Td>
                  ))}
                </SimpleGrid>
              </Tr>
            </Tfoot>
          </Table>
        </Container>
      </Box>
    );
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    /* eslint-disable-next-line no-console */
    console.error("Error fetching participated mahjong sessions:", error);
    captureException(error);

    return <ErrorPage message={error.message} />;
  }
}
