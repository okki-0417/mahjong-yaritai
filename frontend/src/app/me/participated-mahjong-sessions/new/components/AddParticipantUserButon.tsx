"use client";

import { Button, HStack, Text } from "@chakra-ui/react";
import { IoMdAdd } from "react-icons/io";
import { useMahjongSessionForm } from "@/src/app/me/participated-mahjong-sessions/new/contexts/MahjongSessionFormContextProvider";

export default function AddParticipantUserButton() {
  const { appendParticipantUser, gameFields, setValue } = useMahjongSessionForm();

  const handleAddParticipantUser = () => {
    appendParticipantUser({ userId: null, name: "NONAME", avatarUrl: null });

    // 各ゲームの結果に新しい参加者のデータを追加
    gameFields.forEach((_, gameIndex) => {
      setValue(`games.${gameIndex}.results`, [
        ...gameFields[gameIndex].results,
        { resultPoints: null, ranking: null },
      ]);
    });
  };

  return (
    <HStack
      as={Button}
      css={{ writingMode: "vertical-rl" }}
      h="auto"
      gap="1px"
      borderRadius="0"
      borderRightRadius={["sm", "md"]}
      px="0"
      minW={["0", "6"]}
      bg="neutral.100"
      variant="ghost"
      borderLeft="1px solid"
      borderColor="secondary.50"
      onClick={handleAddParticipantUser}>
      <IoMdAdd size={18} />
      <Text as="span" fontSize="xs">
        ユーザーを追加
      </Text>
    </HStack>
  );
}
