"use client";

import ProblemUpdateForm from "@/src/app/what-to-discard-problems/components/forms/ProblemUpdateForm";
import { WhatToDiscardProblem } from "@/src/generated/graphql";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  problem: WhatToDiscardProblem;
  /* eslint-disable-next-line no-unused-vars */
  onProblemUpdated: (updatedProblem: WhatToDiscardProblem) => void;
};

export default function ProblemUpdateFormModal({
  isOpen,
  onClose,
  problem,
  onProblemUpdated,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />

      <ModalContent fontFamily="serif">
        <ModalHeader>何切る問題を編集</ModalHeader>

        <ModalCloseButton onClick={onClose} />

        <ModalBody>
          <ProblemUpdateForm problem={problem} onProblemUpdated={onProblemUpdated} />
        </ModalBody>

        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
