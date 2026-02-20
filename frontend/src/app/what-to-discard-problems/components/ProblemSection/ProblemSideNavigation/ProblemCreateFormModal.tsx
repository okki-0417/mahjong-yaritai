import ProblemCreateForm from "@/src/app/what-to-discard-problems/components/forms/ProblemCreateForm";
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
  /* eslint-disable-next-line no-unused-vars */
  onProblemCreated: (newProblem: WhatToDiscardProblem) => void;
};

export default function ProblemCreateFormModal({ isOpen, onClose, onProblemCreated }: Props) {
  const onProblemCreatedWrapper = (newProblem: WhatToDiscardProblem) => {
    onProblemCreated(newProblem);
    onClose();
  };

  return (
    <Modal
      closeOnEsc={false}
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      scrollBehavior="inside">
      <ModalOverlay />

      <ModalContent fontFamily="serif">
        <ModalHeader>何切る問題を作成</ModalHeader>

        <ModalCloseButton />

        <ModalBody>
          <ProblemCreateForm onProblemCreated={onProblemCreatedWrapper} />
        </ModalBody>

        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
