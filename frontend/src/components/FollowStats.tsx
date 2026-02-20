"use client";

import { HStack, Text, Button, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { IoMdPerson } from "react-icons/io";
import {
  FollowStatsModal,
  FollowStatsModalContext,
} from "@/src/components/Modals/FollowStatsModal";

type Props = {
  followingCount: number;
  followersCount: number;
};

export function FollowStats({ followingCount, followersCount }: Props) {
  const [modalContext, setModalContext] = useState<FollowStatsModalContext>("followings");

  const {
    isOpen: isFollowStatsModalOpen,
    onOpen: onFollowStatsModalOpen,
    onClose: onFollowStatsModalClose,
  } = useDisclosure();

  const handleFollowStatsModalOpen = (context: FollowStatsModalContext) => {
    if (context === "followings") {
      setModalContext("followings");
    } else {
      setModalContext("followers");
    }

    onFollowStatsModalOpen();
  };

  return (
    <>
      <HStack justify="center">
        <Button
          onClick={() => handleFollowStatsModalOpen("followings")}
          bg="secondary.300"
          colorScheme=""
          _hover={{ bg: "secondary.100" }}>
          <HStack>
            <IoMdPerson size={20} color="white" />
            <Text fontSize="sm">フォロー：{followingCount}</Text>
          </HStack>
        </Button>

        <Button
          onClick={() => handleFollowStatsModalOpen("followers")}
          bg="secondary.300"
          colorScheme=""
          _hover={{ bg: "secondary.100" }}
          color="white">
          <HStack>
            <IoMdPerson size={20} color="white" />
            <Text fontSize="sm">フォロワー：{followersCount}</Text>
          </HStack>
        </Button>
      </HStack>

      <FollowStatsModal
        isOpen={isFollowStatsModalOpen}
        onClose={onFollowStatsModalClose}
        context={modalContext}
      />
    </>
  );
}
