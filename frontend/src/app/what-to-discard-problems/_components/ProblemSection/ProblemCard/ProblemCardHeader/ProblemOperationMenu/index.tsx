import DeleteProblem from "@/src/app/what-to-discard-problems/_components/ProblemSection/ProblemCard/ProblemCardHeader/ProblemOperationMenu/DeleteProblem";
import EditProblem from "@/src/app/what-to-discard-problems/_components/ProblemSection/ProblemCard/ProblemCardHeader/ProblemOperationMenu/EditProblem";
import { WhatToDiscardProblem } from "@/src/types/components";
import { memo } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

type Props = {
  problem: WhatToDiscardProblem;
  isMyProblem: boolean;
  onUpdate: (updatedProblem: WhatToDiscardProblem) => void;
};

const ProblemOperationMenu = ({ problem, isMyProblem, onUpdate }: Props) => {
  return (
    <details className="relative group">
      <summary className="p-1 list-none size-fit flex justify-end cursor-pointer marker:hidden">
        <HiOutlineDotsHorizontal size={22} />
      </summary>

      <div className="w-48 bg-transparent absolute z-20 top-8 right-0">
        <ul className="z-50 w-full p-2 rounded-sm bg-neutral text-primary border shadow text-sm flex flex-col divide-y">
          {isMyProblem && (
            <>
              <li className="w-full">
                <EditProblem problem={problem} onUpdate={onUpdate} />
              </li>
              <li className="w-full">
                <DeleteProblem problemId={problem.id} />
              </li>
            </>
          )}
        </ul>
      </div>
    </details>
  );
};

export default memo(ProblemOperationMenu);
