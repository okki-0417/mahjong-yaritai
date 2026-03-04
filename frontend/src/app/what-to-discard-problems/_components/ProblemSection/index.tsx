import ProblemCard from "@/src/app/what-to-discard-problems/_components/ProblemSection/ProblemCard";
import {
  fetchProblems,
  FetchProblemsResult,
} from "@/src/app/what-to-discard-problems/_services/fetchProblems";
import ErrorPage from "@/src/components/errors/ErrorPage";

export default async function ProblemsSection() {
  try {
    const [problemData, me]: FetchProblemsResult = await fetchProblems();

    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-3 items-start justify-items-end">
        <div className="w-full lg:col-span-1">
          {me && (
            <div className="sticky left-20 top-20 w-full ">
              {/* <ProblemsSideNavigation /> */}
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto lg:col-span-2 flex flex-col gap-6">
          {problemData.problems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} me={me} />
          ))}

          {/* <LoadNextPageProblemButton /> */}
        </div>

        <div className="lg:col-span-1">
          <div className="hidden lg:flex justify-start">
            {/* 将来的に他の関連コンテンツを配置予定 */}
          </div>
        </div>
      </div>
    );
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
