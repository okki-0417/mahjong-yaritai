"use client";

import { Avatar, Box, Button, Input, VisuallyHiddenInput, VStack } from "@chakra-ui/react";
import { useMahjongSessionForm } from "@/src/app/me/participated-mahjong-sessions/new/contexts/MahjongSessionFormContextProvider";
import { useParticipantUsersModal } from "@/src/app/me/participated-mahjong-sessions/new/contexts/ParticipantUsersModalContextProvider";

type Props = {
  participantUserIndex: number;
};

export default function ParticipantUserFormControl({ participantUserIndex }: Props) {
  const { register, watch } = useMahjongSessionForm();
  const participantUser = watch(`participantUsers.${participantUserIndex}`);
  const { openModal } = useParticipantUsersModal();

  const handleParticipantUserClick = () => {
    openModal(participantUserIndex);
  };

  const isEven = participantUserIndex % 2 === 1;

  return (
    <Box position="relative">
      <VisuallyHiddenInput
        {...register(`participantUsers.${participantUserIndex}.userId` as const)}
      />
      <VisuallyHiddenInput
        {...register(`participantUsers.${participantUserIndex}.avatarUrl` as const)}
      />
      <Button
        minH="fit-content"
        w="full"
        borderRadius="0"
        onClick={handleParticipantUserClick}
        px="1px"
        py="2"
        bg={isEven ? "neutral.300" : "neutral.200"}
        _hover={{ bg: isEven ? "neutral.400" : "neutral.300" }}>
        <VStack spacing="2" w="full" overflow="hidden">
          <Avatar size={["sm", "md"]} name={participantUser.name} src={participantUser.avatarUrl} />
          <Input
            readOnly
            fontSize={["sm", "md"]}
            fontWeight="bold"
            variant="unstyled"
            textAlign="center"
            color="primary.500"
            overflow="hidden"
            whiteSpace="nowrap"
            w="full"
            maxW="full"
            textTransform="none"
            textOverflow="ellipsis"
            {...register(`participantUsers.${participantUserIndex}.name` as const)}
          />
        </VStack>
      </Button>
    </Box>
  );
}
