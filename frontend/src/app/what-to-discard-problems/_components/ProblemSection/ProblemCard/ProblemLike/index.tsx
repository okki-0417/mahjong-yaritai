"use client";

import LikeButton from "@/src/components/LikeButton";
import NotLoggedInModal from "@/src/components/Modals/NotLoggedInModal";
import { useForm } from "react-hook-form";
import { memo, useState } from "react";
import { useDisclosure } from "@/src/hooks/useDisclosure";
import createWhatToDiscardProblemLike from "@/src/actions/createWhatToDiscardProblemLike";
import useToast from "@/src/hooks/useToast";
import deleteWhatToDiscardProblemLike from "@/src/actions/deleteWhatToDiscardProblemLike";
import useMe from "@/src/hooks/useMe";

type Props = {
  initialMyLikeId: number | null;
  initialLikesCount: number;
  problemId: number;
};

const ProblemLikeSection = ({
  problemId,
  initialMyLikeId,
  initialLikesCount,
}: Props) => {
  const { isLoggedIn } = useMe();

  const [likeId, setLikeId] = useState<number | null>(initialMyLikeId);
  const [likesCount, setLikesCount] = useState(initialLikesCount);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const {
    formState: { isSubmitting },
    handleSubmit,
  } = useForm();

  const onSubmit = async () => {
    if (!isLoggedIn) {
      onOpen();
      return;
    }

    if (likeId != null) {
      try {
        await deleteWhatToDiscardProblemLike({ problemId, likeId });
        setLikeId(null);
        setLikesCount(likesCount - 1);
      } catch (error) {
        console.error("いいねの削除に失敗しました:", error);

        toast({
          title: "いいねの削除に失敗しました",
          description: error instanceof Error ? error.message : undefined,
          status: "error",
        });
      }
    } else {
      try {
        const data = await createWhatToDiscardProblemLike(problemId);

        setLikeId(data.id);
        setLikesCount(likesCount + 1);
      } catch (error) {
        console.error("いいねの作成に失敗しました:", error);

        toast({
          title: "いいねの作成に失敗しました",
          description: error instanceof Error ? error.message : undefined,
          status: "error",
        });
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex items-center">
        <LikeButton
          type="submit"
          isLiked={likeId != null}
          likeCount={likesCount}
          isLoading={isSubmitting}
        />
      </form>

      <NotLoggedInModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default memo(ProblemLikeSection);
