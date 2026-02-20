"use client";

import { Button, HStack, Input, useToast } from "@chakra-ui/react";
import { useMahjongSessionForm } from "@/src/app/me/participated-mahjong-sessions/new/contexts/MahjongSessionFormContextProvider";
import { useParticipantUsersModal } from "@/src/app/me/participated-mahjong-sessions/new/contexts/ParticipantUsersModalContextProvider";
import { FormEvent, useState } from "react";
import { FaCheck } from "react-icons/fa6";

type Props = {
  participantUserIndex: number;
};

export default function ParticipantUserNameInput({ participantUserIndex }: Props) {
  const { setValue, watch } = useMahjongSessionForm();
  const { onClose } = useParticipantUsersModal();
  const currentName = watch(`participantUsers.${participantUserIndex}.name`);
  const [name, setName] = useState(currentName);

  const toast = useToast();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (name.trim()) {
      setValue(`participantUsers.${participantUserIndex}.name`, name.trim());
      onClose();
      toast({
        title: "参加者名を更新しました",
        status: "info",
      });
    } else {
      toast({
        title: "参加者名を入力してください",
        status: "warning",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <HStack>
        <Input value={name} onChange={e => setName(e.target.value)} placeholder="参加者名を入力" />
        <Button type="submit" colorScheme="blue">
          <FaCheck />
        </Button>
      </HStack>
    </form>
  );
}
