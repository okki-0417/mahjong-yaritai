import { ParticipatedMahjongSessionsQuery } from "@/src/generated/graphql";
import { Card, CardBody, HStack, ListItem, SimpleGrid, Text, Wrap } from "@chakra-ui/react";
import Link from "next/link";

type Props = {
  mahjongSession: ParticipatedMahjongSessionsQuery["participatedMahjongSessions"]["edges"][0]["node"];
};

export default function MahjongSessionCard({ mahjongSession }: Props) {
  const signedMyTotalProfits =
    mahjongSession.myTotalProfits >= 0
      ? `+${mahjongSession.myTotalProfits}`
      : `${mahjongSession.myTotalProfits}`;

  return (
    <>
      <ListItem key={mahjongSession.id}>
        <Link href={`/me/participated-mahjong-sessions/${mahjongSession.id}`}>
          <Card key={mahjongSession.id}>
            <CardBody
              py={["3", "3"]}
              px={["3", "6"]}
              bg="neutral.100"
              _hover={{
                bg: "neutral.300",
                boxShadow: "dark-lg",
              }}
              color="primary.500"
              transition="all 0.1s"
              borderRadius="md"
              boxShadow="base">
              <Text fontSize="xl">{mahjongSession.name}</Text>

              <SimpleGrid columns={2} alignItems="baseline">
                <HStack gap="1" alignItems="baseline">
                  <Text as="span" fontSize="xs">
                    総収支
                  </Text>
                  <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    color={mahjongSession.myTotalProfits >= 0 ? "blue.600" : "red.400"}>
                    {signedMyTotalProfits}
                  </Text>
                  <Text fontSize="xs">pt</Text>
                </HStack>

                <HStack gap="1" alignItems="baseline">
                  <Text as="span" fontSize="xs">
                    着順
                  </Text>
                  <Text fontSize="2xl">{mahjongSession.myAverageRanking}</Text>
                  <Text fontSize="xs">位</Text>
                </HStack>
              </SimpleGrid>

              <SimpleGrid columns={4} alignItems="baseline">
                <HStack gap="1" alignItems="baseline" mt="2">
                  <Text as="span" fontSize="xs">
                    1位
                  </Text>
                  <Text fontSize="lg" fontWeight="bold">
                    1回
                  </Text>
                </HStack>

                <HStack gap="1" alignItems="baseline" mt="2">
                  <Text as="span" fontSize="xs">
                    2位
                  </Text>
                  <Text fontSize="lg" fontWeight="bold">
                    2回
                  </Text>
                </HStack>

                <HStack gap="1" alignItems="baseline" mt="2">
                  <Text as="span" fontSize="xs">
                    3位
                  </Text>
                  <Text fontSize="lg" fontWeight="bold">
                    0回
                  </Text>
                </HStack>

                <HStack gap="1" alignItems="baseline" mt="2">
                  <Text as="span" fontSize="xs">
                    4位
                  </Text>
                  <Text fontSize="lg" fontWeight="bold">
                    1回
                  </Text>
                </HStack>
              </SimpleGrid>

              <HStack gap="1" alignItems="baseline" mt="2">
                <Text as="span" fontSize="xs">
                  参加者
                </Text>
                <Wrap>
                  {(() => {
                    const participantNames = mahjongSession.participantUsers.map(user => user.name);
                    let namesToShow: string[] = [];
                    let hiddenNames: string[] = [];
                    if (participantNames.length > 4) {
                      namesToShow = participantNames.slice(0, 4);
                      hiddenNames = participantNames.slice(4);
                      namesToShow.push(`他${hiddenNames.length}名`);
                    } else {
                      namesToShow = participantNames;
                    }
                    return namesToShow.map((name, index) => (
                      <Text key={name} fontSize="lg">
                        {name}
                        {index < namesToShow.length - 1 ? "," : ""}
                      </Text>
                    ));
                  })()}
                </Wrap>
              </HStack>
            </CardBody>
          </Card>
        </Link>
      </ListItem>
    </>
  );
}
