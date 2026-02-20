"use client";

import { MutualFollowersQuery } from "@/src/generated/graphql";
import { Avatar, Button, ListItem, Text } from "@chakra-ui/react";
import { useMahjongSessionForm } from "@/src/app/me/participated-mahjong-sessions/new/contexts/MahjongSessionFormContextProvider";

type Props = {
  user: MutualFollowersQuery["mutualFollowers"]["edges"][0]["node"];
  participantUserIndex: number;
  onClose: () => void;
};

export default function ParticipantUserCard({ user, participantUserIndex, onClose }: Props) {
  const { setValue } = useMahjongSessionForm();

  const handleClick = () => {
    setValue(`participantUsers.${participantUserIndex}.userId`, user.id);
    setValue(`participantUsers.${participantUserIndex}.name`, user.name);
    setValue(`participantUsers.${participantUserIndex}.avatarUrl`, user.avatarUrl);
    onClose();
  };

  return (
    <ListItem>
      <Button onClick={handleClick} variant="outline" w="full" justifyContent="flex-start" h="12">
        <Avatar size="sm" name={user.name} src={user.avatarUrl} mr="3" />
        <Text as="span">{user.name}</Text>
      </Button>
    </ListItem>
  );
}
