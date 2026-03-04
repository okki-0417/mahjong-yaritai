"use client";

import { WhatToDiscardProblem } from "@/src/types/components";
import Modal from "@/src/components/Modal";
import { useDisclosure } from "@/src/hooks/useDisclosure";
import deleteWhatToDiscardProblem from "@/src/actions/deleteWhatToDiscardProblem";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useToast from "@/src/hooks/useToast";

type Props = {
  problemId: string | number;
};

export default function DeleteProblem({ problemId }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const onCloseModal = () => {
    setError(null);
    onClose();
  };

  const deleteProblem = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      await deleteWhatToDiscardProblem({ problemId });
      onCloseModal();

      toast({
        title: "問題を削除しました",
        status: "success",
      });

      router.refresh();
    } catch (error) {
      console.error("Failed to delete problem:", error);

      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        className="text-left p-2 inline-block w-full hover:bg-neutral-200 rounded-sm"
        onClick={onOpen}
      >
        削除する
      </button>

      <Modal
        isOpen={isOpen}
        onClose={onCloseModal}
        width="400px"
        height="fit-content"
      >
        <div className="flex flex-col items-center p-4">
          <p className="text-lg">本当に削除しますか？</p>

          {error && <p className="mt-2 text-red-500">{error}</p>}

          <div className="mt-4 flex gap-2 justify-center-">
            <button
              onClick={onCloseModal}
              className="px-4 py-2 rounded bg-neutral hover:bg-neutral-200 border"
            >
              キャンセル
            </button>
            <button
              onClick={deleteProblem}
              className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              disabled={isLoading}
            >
              {isLoading ? "削除中..." : "削除する"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
