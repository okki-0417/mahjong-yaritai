"use client";

import { SimpleGrid, Td, Text, VStack } from "@chakra-ui/react";
import { useMahjongSessionForm } from "@/src/app/me/participated-mahjong-sessions/new/contexts/MahjongSessionFormContextProvider";

export default function TotalProfitsFormControls() {
  const { participantUserFields, watch } = useMahjongSessionForm();
  const participantUsers = watch("participantUsers");
  const games = watch("games");
  const rate = watch("rate");
  const totalProfitsByParticipant = participantUsers.map((_, participantIndex) => {
    return games.reduce((acc, game) => {
      const profit = (game.results[participantIndex]?.resultPoints || 0) * rate;

      return acc + profit;
    }, 0);
  });

  return (
    <SimpleGrid as="div" columns={participantUserFields.length} w="full">
      {totalProfitsByParticipant.map((totalProfit, index) => (
        <Td
          as={VStack}
          key={participantUserFields[index].id}
          px="1"
          py={["2", "4"]}
          borderBottom=""
          _even={{ bg: "neutral.300" }}>
          <Text
            fontSize={["md", "2xl"]}
            fontWeight="bold"
            color={totalProfit > 0 ? "blue.500" : totalProfit < 0 ? "red.500" : "inherit"}>
            {totalProfit}
          </Text>
        </Td>
      ))}
    </SimpleGrid>
  );
}
