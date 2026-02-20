"use client";

import {
  WhatToDiscardProblem,
  DeleteWhatToDiscardProblemDocument,
  DeleteWhatToDiscardProblemMutation,
  DeleteWhatToDiscardProblemMutationVariables,
} from "@/src/generated/graphql";
import { HStack, MenuItem, useToast } from "@chakra-ui/react";
import { AiOutlineDelete } from "react-icons/ai";
import { useMutation } from "@apollo/client/react";
import useProblems from "@/src/app/what-to-discard-problems/hooks/useProblems";

type Props = {
  problem: WhatToDiscardProblem;
};

export default function ProblemDeleteItem({ problem }: Props) {
  const { setProblems } = useProblems();
  const toast = useToast();

  const filterDeletedProblem = (deletedProblemId: string) => {
    setProblems(prevProblems => prevProblems.filter(p => p.id !== deletedProblemId));
  };

  const [deleteWhatToDiscardProblem, { loading }] = useMutation<
    DeleteWhatToDiscardProblemMutation,
    DeleteWhatToDiscardProblemMutationVariables
  >(DeleteWhatToDiscardProblemDocument, {
    onCompleted: data => {
      toast({
        title: "問題を削除しました",
        status: "success",
      });

      filterDeletedProblem(data.deleteWhatToDiscardProblem.id);
    },
    onError: error => {
      toast({
        title: "問題の削除に失敗しました",
        description: error.message,
        status: "error",
      });
    },
  });

  const handleDelete = async () => {
    const isConfirmed = confirm("この問題を削除しますか？この操作は取り消せません。");
    if (!isConfirmed) return;

    await deleteWhatToDiscardProblem({
      variables: {
        input: {
          id: problem.id,
        },
      },
    });
  };

  return (
    <MenuItem onClick={handleDelete} isDisabled={loading}>
      <HStack>
        <AiOutlineDelete size={18} color="red" />
        <span className="text-red-500">削除する</span>
      </HStack>
    </MenuItem>
  );
}
