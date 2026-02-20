"use client";

import ParticipantUserNameInput from "@/src/app/me/participated-mahjong-sessions/new/components/ParticipantUserNameInput";
import ParticipantUserSelection from "@/src/app/me/participated-mahjong-sessions/new/components/ParticipantUserSelection";
import RemoveParticipantUserButton from "@/src/app/me/participated-mahjong-sessions/new/components/RemoveParticipantUserButton";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  participantUserIndex: number;
};

export default function ParticipantUsersModal({ isOpen, onClose, participantUserIndex }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent fontFamily="PT Serif, serif" h="80vh">
        <ModalCloseButton />
        <ModalHeader>
          <VStack align="stretch">
            <Text>参加者を編集</Text>
            <ParticipantUserNameInput participantUserIndex={participantUserIndex} />
          </VStack>
        </ModalHeader>
        <ModalBody h="full">
          <ParticipantUserSelection participantUserIndex={participantUserIndex} onClose={onClose} />
        </ModalBody>
        <ModalFooter>
          <RemoveParticipantUserButton participantUserIndex={participantUserIndex} />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
