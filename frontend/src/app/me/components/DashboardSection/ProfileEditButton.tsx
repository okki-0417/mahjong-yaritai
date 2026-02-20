"use client";

import ProfileEditModal from "@/src/components/Modals/ProfileEditModal";
import useGetSession from "@/src/hooks/useGetSession";
import { Button, useDisclosure } from "@chakra-ui/react";
import { FiEdit } from "react-icons/fi";

export default function ProfileEditButton() {
  const { session } = useGetSession();
  const {
    isOpen: isProfileEditModalOpen,
    onOpen: onProfileEditModalOpen,
    onClose: onProfileEditModalClose,
  } = useDisclosure();

  return (
    <>
      <Button
        onClick={onProfileEditModalOpen}
        variant="ghost"
        size="sm"
        colorScheme=""
        color="neutral.50"
        _hover={{ bg: "secondary.300" }}>
        <FiEdit size={22} color="white" />
      </Button>

      <ProfileEditModal
        profile={session?.user}
        isOpen={isProfileEditModalOpen}
        onClose={onProfileEditModalClose}
      />
    </>
  );
}
