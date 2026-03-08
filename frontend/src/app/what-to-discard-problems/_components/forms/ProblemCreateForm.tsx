"use client";

import { SubmitHandler } from "react-hook-form";
import useProblemForm from "@/src/hooks/useProblemForm";
import { WhatToDiscardProblem } from "@/src/types/components";
import createWhatToDiscardProblem from "@/src/actions/createWhatToDiscardProblem";
import { CreateWhatToDiscardProblemForm } from "@/src/types/forms";
import useToast from "@/src/hooks/useToast";

type Props = {
  onCreate: (newProblem: WhatToDiscardProblem) => void;
};

export default function ProblemCreateForm({ onCreate }: Props) {
  const { BaseForm, setError, reset } = useProblemForm();
  const toast = useToast();

  const onSubmit: SubmitHandler<CreateWhatToDiscardProblemForm> = async (
    formData,
  ) => {
    try {
      const newProblem = await createWhatToDiscardProblem({
        formData,
      });
      reset();
      toast({
        title: "問題を作成しました",
        status: "success",
      });
      onCreate(newProblem);
    } catch (error) {
      setError("root", {
        type: "server",
        message:
          error instanceof Error
            ? error.message
            : "問題の作成に失敗しました。時間をおいて再度お試しください。",
      });
      toast({
        title: "問題の作成に失敗しました",
        description: "エラーメッセージを確認してください",
        status: "error",
      });
    }
  };

  return <BaseForm onSubmit={onSubmit} />;
}
