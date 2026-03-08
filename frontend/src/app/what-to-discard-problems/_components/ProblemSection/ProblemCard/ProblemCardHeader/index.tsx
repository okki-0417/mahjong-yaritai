"use client";

import ProblemOperationMenu from "@/src/app/what-to-discard-problems/_components/ProblemSection/ProblemCard/ProblemCardHeader/ProblemOperationMenu";
import UserModal from "@/src/components/Modals/UserModal";
import { useDisclosure } from "@/src/hooks/useDisclosure";
import useMe from "@/src/hooks/useMe";
import { WhatToDiscardProblem } from "@/src/types/components";

type Props = {
  problem: WhatToDiscardProblem;
  onUpdate: (updatedProblem: WhatToDiscardProblem) => void;
};

const ProblemCardHeader = ({ problem, onUpdate }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { me } = useMe();
  const isMyProblem = me?.id === problem.user.id;

  return (
    <div className="flex justify-between gap-2">
      <button
        onClick={onOpen}
        className="p-1 flex items-center gap-2 hover:bg-neutral/20 rounded-sm"
      >
        <div
          style={{
            backgroundImage: `url(${problem.user.avatar_url || "/no-image.webp"})`,
          }}
          className="size-10 border rounded-full bg-white bg-cover bg-center"
        />
        <p>{problem.user.name}</p>
      </button>

      <div className="flex gap-2">
        {isMyProblem && (
          <ProblemOperationMenu
            problem={problem}
            isMyProblem={isMyProblem}
            onUpdate={onUpdate}
          />
        )}
      </div>

      {isOpen && (
        <UserModal
          userId={problem.user.id}
          meId={me?.id}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </div>
  );
};

export default ProblemCardHeader;
