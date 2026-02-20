"use client";

import {
  CreateWhatToDiscardProblemLikeInput,
  CreateWhatToDiscardProblemLikeMutationVariables,
  DeleteWhatToDiscardProblemLikeInput,
  DeleteWhatToDiscardProblemLikeMutationVariables,
} from "@/src/generated/graphql";
import { useDisclosure, useToast } from "@chakra-ui/react";
import LikeButton from "@/src/components/LikeButton";
import { useMutation } from "@apollo/client/react";
import {
  CreateWhatToDiscardProblemLikeDocument,
  DeleteWhatToDiscardProblemLikeDocument,
} from "@/src/generated/graphql";
import NotLoggedInModal from "@/src/components/Modals/NotLoggedInModal";
import { useForm } from "react-hook-form";
import { useState } from "react";
import useGetSession from "@/src/hooks/useGetSession";

type Props = {
  initialIsLiked: boolean;
  initialLikesCount: number;
  problemId: string;
};

export default function ProblemLikeSection({
  problemId,
  initialIsLiked,
  initialLikesCount,
}: Props) {
  const { session } = useGetSession();
  const isLoggedIn = session?.isLoggedIn;

  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const toast = useToast();
  const {
    isOpen: isNotLoggedInModalOpen,
    onOpen: onNotLoggedInModalOpen,
    onClose: onNotLoggedInModalClose,
  } = useDisclosure();

  const [createLike] = useMutation<
    CreateWhatToDiscardProblemLikeInput,
    CreateWhatToDiscardProblemLikeMutationVariables
  >(CreateWhatToDiscardProblemLikeDocument, {
    onCompleted: () => {
      setIsLiked(true);
      setLikesCount(prev => prev + 1);
      toast({ title: "いいねしました", status: "success" });
    },
    onError: error => {
      toast({
        status: "error",
        title: "いいねに失敗しました",
        description: error.message,
      });
    },
  });

  const [deleteLike] = useMutation<
    DeleteWhatToDiscardProblemLikeInput,
    DeleteWhatToDiscardProblemLikeMutationVariables
  >(DeleteWhatToDiscardProblemLikeDocument, {
    onCompleted: () => {
      setIsLiked(false);
      setLikesCount(prev => prev - 1);
      toast({ title: "いいねを取り消しました", status: "success" });
    },
    onError: error => {
      toast({
        status: "error",
        title: "いいねの取り消しに失敗しました",
        description: error.message,
      });
    },
  });

  const {
    formState: { isSubmitting },
    handleSubmit,
  } = useForm();

  const onSubmit = async () => {
    if (!isLoggedIn) {
      onNotLoggedInModalOpen();
      return;
    }

    if (isLiked) {
      await deleteLike({
        variables: {
          whatToDiscardProblemId: problemId,
        },
      });
    } else {
      await createLike({
        variables: {
          problemId,
        },
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex items-center">
        <LikeButton
          type="submit"
          isLiked={isLiked}
          likeCount={likesCount}
          isLoading={isSubmitting}
        />
      </form>

      <NotLoggedInModal isOpen={isNotLoggedInModalOpen} onClose={onNotLoggedInModalClose} />
    </>
  );
}
