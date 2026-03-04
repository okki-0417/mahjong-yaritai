import DeleteProblem from "@/src/app/what-to-discard-problems/_components/ProblemSection/ProblemCard/ProblemCardHeader/ProblemOperationMenu/DeleteProblem";
import { WhatToDiscardProblem } from "@/src/types/components";
import Link from "next/link";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

type Props = {
  problem: WhatToDiscardProblem;
  isMyProblem: boolean;
};

export default function ProblemOperationMenu({ problem, isMyProblem }: Props) {
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
                <Link
                  href={`/what-to-discard-problems/${problem.id}/edit`}
                  className="p-2 inline-block w-full hover:bg-neutral-200 rounded-sm"
                >
                  編集する
                </Link>
              </li>
              <li className="w-full">
                <div>
                  <DeleteProblem problemId={problem.id} />
                </div>
              </li>
            </>
          )}
        </ul>
      </div>
    </details>
  );
}
