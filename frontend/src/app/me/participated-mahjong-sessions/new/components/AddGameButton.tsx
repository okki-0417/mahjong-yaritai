"use client";

import { Button, HStack, Text } from "@chakra-ui/react";
import { IoMdAdd } from "react-icons/io";
import { useMahjongSessionForm } from "@/src/app/me/participated-mahjong-sessions/new/contexts/MahjongSessionFormContextProvider";

export default function AddGameButton() {
  const { appendGame, participantUserFields, watch } = useMahjongSessionForm();

  const handleAddGame = () => {
    appendGame({
      results: participantUserFields.map(() => ({ resultPoints: null, ranking: null })),
    });
  };

  const games = watch("games");
  const lastGame = games[games.length - 1];
  const isLastGameEmpty = lastGame?.results.every(
    result => isNaN(result.resultPoints) || result.resultPoints === null,
  );

  return (
    <HStack
      as={Button}
      variant="ghost"
      onClick={handleAddGame}
      h={["fit-content", "5"]}
      align="center"
      gap="0"
      isDisabled={isLastGameEmpty}>
      <IoMdAdd size={16} />
      <Text as="span" fontSize="xs">
        ゲームを追加
      </Text>
    </HStack>
  );
}
