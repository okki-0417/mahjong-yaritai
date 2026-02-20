"use client";

import LoadNextPageProblemButton from "@/src/app/what-to-discard-problems/components/LoadNextPageProblemButton";
import ProblemCard from "@/src/app/what-to-discard-problems/components/ProblemSection/ProblemCard";
import WhatToDiscardProblemsSideNavigation from "@/src/app/what-to-discard-problems/components/ProblemSection/ProblemSideNavigation";
import useProblems from "@/src/app/what-to-discard-problems/hooks/useProblems";
import useGetSession from "@/src/hooks/useGetSession";

export default function ProblemClientSection() {
  const { session } = useGetSession();
  const isLoggedIn = session?.isLoggedIn;

  const { problems } = useProblems();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-3 items-start justify-items-end">
      <div className="w-full lg:col-span-1">
        <div className="sticky left-20 top-20 w-full ">
          {isLoggedIn && <WhatToDiscardProblemsSideNavigation />}
        </div>
      </div>
      <div className="max-w-4xl mx-auto lg:col-span-2 flex flex-col gap-6">
        {problems.map(problem => (
          <ProblemCard key={problem.id} problem={problem} />
        ))}

        <LoadNextPageProblemButton />
      </div>
      <div className="lg:col-span-1">
        <div className="hidden lg:flex justify-start">
          {/* 将来的に他の関連コンテンツを配置予定 */}
        </div>
      </div>
    </div>
  );
}
