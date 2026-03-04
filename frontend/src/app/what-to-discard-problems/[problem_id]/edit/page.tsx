import WhatToDiscardProblemEditForm from "@/src/app/what-to-discard-problems/[problem_id]/edit/_components/WhatToDiscardProblemEditForm";
import fetchWhatToDiscardProblem from "@/src/app/what-to-discard-problems/[problem_id]/edit/_services/fetchWhatToDiscardProblem";
import ErrorPage from "@/src/components/errors/ErrorPage";

type Props = {
  params: Promise<{ problem_id: string }>;
};

export default async function EditWhatToDiscardProblem({ params }: Props) {
  try {
    const { problem_id } = await params;

    const data = await fetchWhatToDiscardProblem(problem_id);

    return (
      <div className="lg:w-3xl mx-auto mt-16">
        <h1 className="text-3xl">問題を編集</h1>

        <div className="mt-8">
          <WhatToDiscardProblemEditForm problem={data} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching problem:", error);

    return (
      <ErrorPage
        message={
          error instanceof Error
            ? error.message
            : "An unknown error occurred while fetching the problem."
        }
      />
    );
  }
}
