import ProblemClientSection from "@/src/app/what-to-discard-problems/components/ProblemSection/ProblemClientSection";
import ProblemsContextProvider from "@/src/app/what-to-discard-problems/contexts/ProblemsContextProvider";
import ErrorPage from "@/src/components/errors/ErrorPage";
import { WhatToDiscardProblemsDocument } from "@/src/generated/graphql";
import { getClient } from "@/src/lib/apollo/server";
import * as Sentry from "@sentry/nextjs";

export default async function ProblemsSection() {
  const client = getClient();

  try {
    const { data: problemsData } = await client.query({
      query: WhatToDiscardProblemsDocument,
      variables: {
        first: 20,
      },
    });

    const initialProblems = problemsData.whatToDiscardProblems.edges.map(edge => edge.node);
    const pageInfo = problemsData.whatToDiscardProblems.pageInfo;

    return (
      <ProblemsContextProvider initialProblems={initialProblems} initialPageInfo={pageInfo}>
        <ProblemClientSection />
      </ProblemsContextProvider>
    );
  } catch (error) {
    /* eslint-disable-next-line no-console */
    console.error("ProblemSection error:", error);
    Sentry.captureException(error);

    return <ErrorPage message={error.message} />;
  }
}
