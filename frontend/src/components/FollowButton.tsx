"use client";

import { useState, useTransition } from "react";
import NotLoggedInModal from "@/src/components/Modals/NotLoggedInModal";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDisclosure } from "@/src/hooks/useDisclosure";
import { followAction, unfollowAction } from "@/src/actions/followingsAction";
import useToast from "@/src/hooks/useToast";

type Props = {
  userId: string | number;
  initialIsFollowing?: boolean;
};

export default function FollowButton({ userId, initialIsFollowing }: Props) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();

  const toast = useToast();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit: SubmitHandler<{}> = async () => {
    if (isFollowing) {
      startTransition(async () => {
        const result = await unfollowAction(String(userId));
        if (result.errors) {
          toast({
            title: "フォロー解除に失敗",
            description: result.errors[0] || "もう一度試してください。",
            status: "error",
          });
          return;
        }

        setIsFollowing(false);
      });
    } else {
      startTransition(async () => {
        const result = await followAction(String(userId));

        if (result.errors) {
          toast({
            title: "フォローに失敗",
            description: result.errors[0] || "もう一度試してください。",
            status: "error",
          });
          return;
        }

        setIsFollowing(true);
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <button
          type="submit"
          disabled={isSubmitting || isPending}
          className={`px-4 py-2 rounded-sm disabled:bg-gray-400 ${isFollowing ? "bg-gray-400 hover:bg-gray-500 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
        >
          {isSubmitting || isPending
            ? "処理中..."
            : isFollowing
              ? "フォロー解除"
              : "フォロー"}
        </button>
      </form>
    </>
  );
}
