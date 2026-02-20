"use client";

import { SimpleGrid, Td, Text, VStack } from "@chakra-ui/react";
import { useMahjongSessionForm } from "@/src/app/me/participated-mahjong-sessions/new/contexts/MahjongSessionFormContextProvider";

export default function AverageRakingFormControls() {
  const { participantUserFields, watch } = useMahjongSessionForm();
  const games = watch("games");

  const averageRankingByParticipant = participantUserFields.map((_, participantIndex) => {
    // 各ゲームから該当参加者の ranking を取得
    const rankings = games
      .map(game => game.results[participantIndex]?.ranking)
      .filter(ranking => ranking !== null && ranking !== undefined && !Number.isNaN(ranking));

    // 有効なゲームがない場合
    if (rankings.length === 0) return 0;

    // 平均順位を計算（小数点2桁まで）
    const totalRanking = rankings.reduce((acc, ranking) => acc + ranking, 0);
    const rawAverageRanking = totalRanking / rankings.length;
    const multiplied = rawAverageRanking * 100;
    return Math.round(multiplied) / 100;
  });

  return (
    <SimpleGrid as="div" columns={participantUserFields.length} w="full">
      {participantUserFields.map(participant => (
        <Td
          as={VStack}
          key={participant.id}
          textAlign="center"
          px="1"
          py={["2", "4"]}
          fontSize={["lg", "xl"]}
          borderBottom=""
          _even={{ bg: "neutral.300" }}>
          <Text fontSize={["xl", "2xl"]}>
            {averageRankingByParticipant[participantUserFields.indexOf(participant)] || "-"}
          </Text>
        </Td>
      ))}
    </SimpleGrid>
  );
}
