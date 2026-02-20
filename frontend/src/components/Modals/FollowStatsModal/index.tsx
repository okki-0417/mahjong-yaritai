"use client";

import FollowStatsTabs from "@/src/components/Modals/FollowStatsModal/FollowStatsTabs";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react";

export type FollowStatsModalContext = "followings" | "followers";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  context: FollowStatsModalContext;
};

export function FollowStatsModal({ isOpen, onClose, context }: Props) {
  const defaultIndex = context === "followings" ? 0 : 1;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside" isCentered>
      <ModalOverlay />
      <ModalContent minH="md" bg="gray.50" color="secondary.500">
        <ModalCloseButton />
        <ModalHeader />

        <ModalBody fontFamily="serif">
          <FollowStatsTabs defaultIndex={defaultIndex} />
        </ModalBody>

        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
