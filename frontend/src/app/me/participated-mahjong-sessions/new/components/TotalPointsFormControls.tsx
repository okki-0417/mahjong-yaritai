"use client";

import TotalPointsFormControl from "@/src/app/me/participated-mahjong-sessions/new/components/TotalPointsFormControl";
import { SimpleGrid } from "@chakra-ui/react";
import { useMahjongSessionForm } from "@/src/app/me/participated-mahjong-sessions/new/contexts/MahjongSessionFormContextProvider";

export default function TotalPointsFormControls() {
  const { participantUserFields, watch } = useMahjongSessionForm();
  const participantUsers = watch("participantUsers");
  const games = watch("games");

  const totalPointsByParticipant = participantUsers.map((_, participantIndex) => {
    return games.reduce((acc, game) => {
      return acc + (game.results[participantIndex]?.resultPoints || 0);
    }, 0);
  });

  return (
    <SimpleGrid as="div" columns={participantUsers.length} w="full">
      {totalPointsByParticipant.map((totalPoints, participantIndex) => (
        <TotalPointsFormControl
          key={participantUserFields[participantIndex].id}
          participantUserFieldId={participantUserFields[participantIndex].id}
          totalPoints={totalPoints}
        />
      ))}
    </SimpleGrid>
  );
}
