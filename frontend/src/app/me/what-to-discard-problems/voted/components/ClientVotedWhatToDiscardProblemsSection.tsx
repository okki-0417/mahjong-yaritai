"use client";

import fetchVotedProblemsAction from "@/src/app/me/what-to-discard-problems/voted/actions/fetchVotedProblemsAction";
import ProblemCard from "@/src/app/what-to-discard-problems/components/ProblemSection/ProblemCard";
import { ProblemsContext } from "@/src/app/what-to-discard-problems/contexts/ProblemsContextProvider";
import { useToast, VStack } from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useMemo, useRef, useTransition } from "react";

export default function ClientVotedWhatToDiscardProblemsSection() {
  const { problems, setProblems, setPageInfo, pageInfo } = useContext(ProblemsContext);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [isPending, startTransition] = useTransition();

  const toast = useToast();

  const handleEntry = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (!entry.isIntersecting) return;
      if (isPending) return;

      startTransition(async () => {
        const {
          problems: nextProblems,
          pageInfo: newPageInfo,
          error,
        } = await fetchVotedProblemsAction({ pageInfo });

        if (error) {
          toast({
            title: "何切る問題を取得できませんでした",
            description: error.message,
            status: "error",
          });
        } else if (nextProblems && newPageInfo) {
          setProblems(prevProblems => [...prevProblems, ...nextProblems]);
          setPageInfo(newPageInfo);
        }
      });
    },
    [pageInfo, setProblems, setPageInfo, toast, isPending],
  );

  const observer = useMemo(() => new IntersectionObserver(handleEntry), [handleEntry]);

  useEffect(() => {
    if (!targetRef.current) return undefined;

    observer.observe(targetRef.current);
    return () => observer.disconnect();
  }, [observer]);

  return (
    <VStack spacing="6">
      {problems.map(problem => (
        <ProblemCard key={problem.id} problem={problem} />
      ))}

      <div ref={targetRef}>
        {pageInfo && pageInfo.hasNextPage ? "読み込み中..." : "全ての問題を読み込みました ✅"}
      </div>
    </VStack>
  );
}
