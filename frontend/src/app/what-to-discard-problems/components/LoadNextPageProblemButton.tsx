"use client";

import { useLazyQuery } from "@apollo/client/react";
import { WhatToDiscardProblemsDocument } from "@/src/generated/graphql";
import useProblems from "@/src/app/what-to-discard-problems/hooks/useProblems";
import { Button, Text, useToast } from "@chakra-ui/react";

export default function LoadNextPageProblemButton() {
  const { pageInfo, setPageInfo, setProblems } = useProblems();

  const [getMoreProblems, { loading }] = useLazyQuery(WhatToDiscardProblemsDocument);
  const toast = useToast();

  const handleLoadNextPage = async () => {
    if (!pageInfo.hasNextPage || !pageInfo.endCursor || loading) return;

    const { data, error } = await getMoreProblems({
      variables: {
        after: pageInfo.endCursor,
        first: 3,
      },
    });

    if (error) {
      toast({
        title: "エラーが発生しました",
        description: error.message,
        status: "error",
      });
    }

    if (data) {
      const newProblems = data.whatToDiscardProblems.edges.map((edge: any) => edge.node);
      const newPageInfo = data.whatToDiscardProblems.pageInfo;

      setProblems(prevProblems => [...prevProblems, ...newProblems]);
      setPageInfo(newPageInfo);
    }
  };

  return (
    <>
      {pageInfo.hasNextPage ? (
        <Button isLoading={loading} onClick={handleLoadNextPage} variant="outline">
          <Text className="text-neutral">さらに読み込む</Text>
        </Button>
      ) : (
        <Text>これ以上問題はありません</Text>
      )}
    </>
  );
}
