"use client";

import { memo, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { followAction, unfollowAction } from "@/src/actions/followingsAction";
import useToast from "@/src/hooks/useToast";

type Props = {
  meId: number | null;
  userId: string | number;
  initialIsFollowing?: boolean;
};

const FollowButton = ({ meId, userId, initialIsFollowing }: Props) => {
  if (!meId) return null;

  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();

  const toast = useToast();

  const { handleSubmit } = useForm();

  const onSubmit: SubmitHandler<{}> = async () => {
    if (isFollowing) {
      startTransition(async () => {
        const result = await unfollowAction(userId);
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
        const result = await followAction(userId);

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
          disabled={isPending}
          className={`px-4 py-2 rounded-sm disabled:bg-gray-400 ${isFollowing ? "bg-gray-400 hover:bg-gray-500 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
        >
          {isPending ? "処理中..." : isFollowing ? "フォロー解除" : "フォロー"}
        </button>
      </form>
    </>
  );
};

export default memo(FollowButton);
