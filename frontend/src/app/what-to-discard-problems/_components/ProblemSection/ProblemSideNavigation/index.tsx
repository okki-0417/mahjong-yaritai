"use client";

import CreateProblemButton from "@/src/app/what-to-discard-problems/_components/ProblemSection/ProblemSideNavigation/CreateProblemButton";
import { WhatToDiscardProblem } from "@/src/types/components";

type Props = {
  onCreate: (newProblem: WhatToDiscardProblem) => void;
};

export default function ProblemsSideNavigation({ onCreate }: Props) {
  return (
    <nav className="w-xs p-2 bg-neutral text-primary rounded-sm">
      <ul>
        <li>
          <CreateProblemButton onCreate={onCreate} />
        </li>
      </ul>
    </nav>
  );
}
