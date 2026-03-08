import ProblemClientSection from "@/src/app/what-to-discard-problems/_components/ProblemSection/ProblemClientSection";
import { fetchProblems } from "@/src/app/what-to-discard-problems/_services/fetchProblems";
import ErrorPage from "@/src/components/errors/ErrorPage";
import { WhatToDiscardProblemList } from "@/src/types/components";

export default async function ProblemsSection() {
  try {
    const problemData: WhatToDiscardProblemList = await fetchProblems();

    return <ProblemClientSection initialProblemList={problemData} />;
  } catch (error) {
    console.error("ProblemSection error:", error);

    return (
      <ErrorPage
        message={
          error instanceof Error ? error.message : "問題の取得に失敗しました。"
        }
      />
    );
  }
}
