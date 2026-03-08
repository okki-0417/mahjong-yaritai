"use client";

import ProblemCard from "@/src/app/what-to-discard-problems/_components/ProblemSection/ProblemCard";
import ProblemsSideNavigation from "@/src/app/what-to-discard-problems/_components/ProblemSection/ProblemSideNavigation";
import useMe from "@/src/hooks/useMe";
import {
  WhatToDiscardProblem,
  WhatToDiscardProblemList,
} from "@/src/types/components";
import { useCallback, useState } from "react";

type Props = {
  initialProblemList: WhatToDiscardProblemList;
};

export default function ProblemClientSection({ initialProblemList }: Props) {
  const [problems, setProblems] = useState<WhatToDiscardProblem[]>(
    initialProblemList.problems,
  );
  const { isLoggedIn } = useMe();

  const onCreate = useCallback((newProblem: WhatToDiscardProblem) => {
    setProblems((prevProblems) => [newProblem, ...prevProblems]);
  }, []);

  const onUpdate = useCallback((updatedProblem: WhatToDiscardProblem) => {
    setProblems((prevProblems) =>
      prevProblems.map((problem) =>
        updatedProblem.id === problem.id ? updatedProblem : problem,
      ),
    );
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-3 items-start justify-items-end">
      <div className="w-full lg:col-span-1 h-full">
        {isLoggedIn && (
          <div>
            <ProblemsSideNavigation onCreate={onCreate} />
          </div>
        )}
      </div>

      <div className="lg:col-span-2 flex flex-col gap-6">
        {problems.map((problem) => (
          <ProblemCard key={problem.id} problem={problem} onUpdate={onUpdate} />
        ))}
      </div>

      <div className="lg:col-span-1">
        <div className="hidden lg:flex justify-start">
          {/* 将来的に他の関連コンテンツを配置予定 */}
        </div>
      </div>
    </div>
  );
}
