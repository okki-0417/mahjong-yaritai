"use client";

import { SubmitHandler } from "react-hook-form";
import {
  CreateWhatToDiscardProblemInput,
  CreateWhatToDiscardProblemMutation,
  CreateWhatToDiscardProblemMutationVariables,
  WhatToDiscardProblem,
} from "@/src/generated/graphql";
import useProblemForm from "@/src/hooks/useProblemForm";
import { useMutation } from "@apollo/client/react";
import { CreateWhatToDiscardProblemDocument } from "@/src/generated/graphql";
import { useToast } from "@chakra-ui/react";

type CreateProblemFormInputs = CreateWhatToDiscardProblemInput;

type Props = {
  /* eslint-disable-next-line no-unused-vars */
  onProblemCreated: (newProblem: WhatToDiscardProblem) => void;
};

export default function ProblemCreateForm({ onProblemCreated }: Props) {
  const toast = useToast();

  const [createProblem] = useMutation<
    CreateWhatToDiscardProblemMutation,
    CreateWhatToDiscardProblemMutationVariables
  >(CreateWhatToDiscardProblemDocument, {
    onCompleted: data => {
      onProblemCreated(data.createWhatToDiscardProblem.whatToDiscardProblem);
      toast({
        title: "何切る問題を作成しました",
        status: "success",
      });
    },
    onError: error => {
      toast({
        title: "何切る問題の作成に失敗しました",
        description: error.message,
        status: "error",
      });
    },
  });

  const { BaseForm } = useProblemForm();

  const onSubmit: SubmitHandler<CreateProblemFormInputs> = async formData => {
    const isConfirmed = confirm("これで作成しますか？");
    if (!isConfirmed) return;

    await createProblem({
      variables: {
        input: {
          ...formData,
        },
      },
    });
  };

  return <BaseForm onSubmit={onSubmit} />;
}
