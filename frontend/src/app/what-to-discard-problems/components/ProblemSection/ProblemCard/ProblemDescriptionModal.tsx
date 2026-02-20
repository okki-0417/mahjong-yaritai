"use client";

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

export default function ProblemDescriptionModal({
  description,
  isOpen,
  onClose,
}: {
  description: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside" isCentered={true}>
      <ModalOverlay />

      <ModalContent className="text-primary font-[PT_Serif,serif]">
        <ModalHeader>作者のコメント</ModalHeader>

        <ModalCloseButton />

        <ModalBody>
          <Text whiteSpace="pre-line">{description}</Text>
        </ModalBody>

        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
