"use client";

import ProblemCreateFormModal from "@/src/app/what-to-discard-problems/_components/ProblemSection/ProblemSideNavigation/ProblemCreateFormModal";
import { useDisclosure } from "@/src/hooks/useDisclosure";
import { IoCreate } from "react-icons/io5";

export default function CreateProblemButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <button className="w-full flex gap-2" onClick={onOpen}>
        <IoCreate size={20} />
        <span>問題を作成する</span>
      </button>

      {/* <ProblemCreateFormModal
        isOpen={isOpen}
        onClose={onClose}
        onProblemCreated={onClose}
      /> */}
    </>
  );
}
