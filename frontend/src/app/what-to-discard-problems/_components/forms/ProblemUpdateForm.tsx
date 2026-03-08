"use client";

import { SubmitHandler } from "react-hook-form";
import useProblemForm from "@/src/hooks/useProblemForm";
import { WhatToDiscardProblem } from "@/src/types/components";
import { UpdateWhatToDiscardProblemForm } from "@/src/types/forms";
import updateWhatToDiscardProblem from "@/src/actions/updateWhatToDiscardProblem";
import useToast from "@/src/hooks/useToast";

type Props = {
  problem: WhatToDiscardProblem;
  onUpdate: (updatedProblem: WhatToDiscardProblem) => void;
};

export default function ProblemUpdateForm({ problem, onUpdate }: Props) {
  const toast = useToast();
  const { BaseForm } = useProblemForm(problem);

  const onSubmit: SubmitHandler<UpdateWhatToDiscardProblemForm> = async (
    formData,
  ) => {
    try {
      const updatedProblem = await updateWhatToDiscardProblem({
        id: problem.id,
        form: formData,
      });

      onUpdate(updatedProblem);

      toast({
        title: "問題を更新しました",
        status: "success",
      });
    } catch (error) {
      console.error("問題の更新に失敗しました", error);

      toast({
        title: "問題の更新に失敗しました",
        status: "error",
        description:
          error instanceof Error
            ? error.message
            : "予期せぬエラーが発生しました",
      });
    }
  };

  return <BaseForm onSubmit={onSubmit} />;
}
