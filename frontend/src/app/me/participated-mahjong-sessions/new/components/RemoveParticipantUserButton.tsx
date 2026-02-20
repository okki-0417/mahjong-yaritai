"use client";

import { Button } from "@chakra-ui/react";
import { useMahjongSessionForm } from "@/src/app/me/participated-mahjong-sessions/new/contexts/MahjongSessionFormContextProvider";
import { useParticipantUsersModal } from "@/src/app/me/participated-mahjong-sessions/new/contexts/ParticipantUsersModalContextProvider";
import { FaUser } from "react-icons/fa6";

type Props = {
  participantUserIndex: number;
};

export default function RemoveParticipantUserButton({ participantUserIndex }: Props) {
  const { removeParticipantUser, participantUserFields, gameFields, setValue } =
    useMahjongSessionForm();
  const { onClose } = useParticipantUsersModal();

  const handleRemove = () => {
    removeParticipantUser(participantUserIndex);

    // 各ゲームの結果から削除された参加者のデータを削除
    gameFields.forEach((gameField, gameIndex) => {
      const newResults = gameField.results.filter((_, index) => index !== participantUserIndex);
      setValue(`games.${gameIndex}.results`, newResults);
    });

    onClose();
  };

  if (participantUserFields.length < 4) {
    return null;
  }

  return (
    <Button
      onClick={handleRemove}
      colorScheme="red"
      variant="outline"
      size="sm"
      leftIcon={<FaUser />}>
      削除
    </Button>
  );
}
