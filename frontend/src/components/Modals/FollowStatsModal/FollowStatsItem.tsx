"use client";

import UserModal from "@/src/components/Modals/UserModal";
import { User } from "@/src/generated/graphql";
import { Avatar, Box, Button, HStack, Text, useDisclosure } from "@chakra-ui/react";

type Props = {
  user: User;
};

export default function FollowStatsItem({ user }: Props) {
  const {
    isOpen: isUserModalOpen,
    onOpen: onUserModalOpen,
    onClose: onUserModalClose,
  } = useDisclosure();

  return (
    <>
      <Button
        onClick={onUserModalOpen}
        size="xl"
        w="full"
        p="2"
        variant="unstyled"
        _hover={{ bg: "neutral.300" }}
        colorScheme=""
        color="secondary.500">
        <HStack spacing={4} justify="start">
          <Box flexGrow="0">
            <Avatar src={user.avatarUrl} />
          </Box>

          <Box flex={1} minW={0}>
            <Text fontWeight="bold" noOfLines={1} textAlign="left">
              {user.name}
            </Text>
          </Box>
        </HStack>
      </Button>

      <UserModal
        isOpen={isUserModalOpen}
        onClose={onUserModalClose}
        user={user}
        isFollowing={user.isFollowing}
      />
    </>
  );
}
