"use client";

import ProblemUpdateForm from "@/src/app/what-to-discard-problems/_components/forms/ProblemUpdateForm";
import Modal from "@/src/components/Modal";
import { WhatToDiscardProblem } from "@/src/types/components";
import { useDisclosure } from "@chakra-ui/react";

type Props = {
  problem: WhatToDiscardProblem;
  onUpdate: (updatedProblem: WhatToDiscardProblem) => void;
};

export default function EditProblem({
  problem,
  onUpdate: initialOnUpdate,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onUpdate = (updatedProblem: WhatToDiscardProblem) => {
    initialOnUpdate(updatedProblem);
    onClose();
  };

  return (
    <div>
      <button
        className="text-left p-2 inline-block w-full hover:bg-neutral-200 rounded-sm"
        onClick={onOpen}
      >
        編集する
      </button>

      {isOpen && (
        <Modal
          maxWidth="100%"
          width="40vw"
          minWidth="375px"
          isOpen={isOpen}
          onClose={onClose}
        >
          <ProblemUpdateForm problem={problem} onUpdate={onUpdate} />
        </Modal>
      )}
    </div>
  );
}
