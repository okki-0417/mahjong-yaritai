import fetchVotedProblemsAction from "@/src/app/me/what-to-discard-problems/voted/actions/fetchVotedProblemsAction";
import ClientVotedWhatToDiscardProblemsSection from "@/src/app/me/what-to-discard-problems/voted/components/ClientVotedWhatToDiscardProblemsSection";
import ProblemsContextProvider from "@/src/app/what-to-discard-problems/contexts/ProblemsContextProvider";
import ErrorPage from "@/src/components/errors/ErrorPage";
import { captureException } from "@sentry/nextjs";

export default async function VotedWhatToDiscardProblemsSection() {
  try {
    const { problems, pageInfo } = await fetchVotedProblemsAction({ pageInfo: null });

    return (
      <ProblemsContextProvider initialProblems={problems} initialPageInfo={pageInfo}>
        <ClientVotedWhatToDiscardProblemsSection />
      </ProblemsContextProvider>
    );
  } catch (error) {
    /* eslint-disable-next-line no-console */
    console.error("ProblemSection error:", error);
    captureException(error);

    return <ErrorPage message={error.message} />;
  }
}
