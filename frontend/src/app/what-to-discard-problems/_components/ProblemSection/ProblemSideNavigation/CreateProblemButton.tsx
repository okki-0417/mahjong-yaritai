"use client";

import ProblemCreateForm from "@/src/app/what-to-discard-problems/_components/forms/ProblemCreateForm";
import Modal from "@/src/components/Modal";
import { useDisclosure } from "@/src/hooks/useDisclosure";
import { WhatToDiscardProblem } from "@/src/types/components";
import { IoCreate } from "react-icons/io5";

type Props = {
  onCreate: (newProblem: WhatToDiscardProblem) => void;
};

export default function CreateProblemButton({
  onCreate: initialOnCreate,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onCreate = (newProblem: WhatToDiscardProblem) => {
    initialOnCreate(newProblem);
    onClose();
  };

  return (
    <>
      <button
        className="p-2 rounded-sm hover:bg-slate-200 w-full flex gap-2"
        onClick={onOpen}
      >
        <IoCreate size={20} />
        <span>問題を作成する</span>
      </button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        maxWidth="100%"
        width="40vw"
        minWidth="375px"
      >
        <ProblemCreateForm onCreate={onCreate} />
      </Modal>
    </>
  );
}
