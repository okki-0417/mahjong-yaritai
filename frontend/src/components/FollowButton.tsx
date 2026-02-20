"use client";

import { Button, useDisclosure, useToast } from "@chakra-ui/react";
import { useMutation } from "@apollo/client/react";
import { CreateFollowDocument, DeleteFollowDocument } from "@/src/generated/graphql";
import { useState } from "react";
import NotLoggedInModal from "@/src/components/Modals/NotLoggedInModal";
import { SubmitHandler, useForm } from "react-hook-form";
import useGetSession from "@/src/hooks/useGetSession";

interface FollowButtonProps {
  userId: string;
  initialIsFollowing: boolean;
  variant?: "solid" | "outline";
  size?: "sm" | "md" | "lg";
  /* eslint-disable-next-line no-unused-vars */
  onFollowChange?: (newIsFollowing: boolean) => void;
}

export default function FollowButton({
  userId,
  initialIsFollowing,
  variant = "solid",
  size = "md",
  onFollowChange,
}: FollowButtonProps) {
  const { session } = useGetSession();
  const isLoggedIn = session?.isLoggedIn;
  const isMe = session?.user.id == userId;

  const toast = useToast();

  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const {
    isOpen: isNotLoggedInModalOpen,
    onOpen: onNotLoggedInModalOpen,
    onClose: onNotLoggedInModalClose,
  } = useDisclosure();

  const [createFollow] = useMutation(CreateFollowDocument, {
    onCompleted: () => {
      setIsFollowing(true);
      onFollowChange?.(true);
      toast({ title: "フォローしました", status: "success" });
    },
    onError: error => {
      toast({ title: "フォローの操作に失敗しました", status: "error", description: error.message });
    },
  });
  const [deleteFollow] = useMutation(DeleteFollowDocument, {
    onCompleted: () => {
      setIsFollowing(false);
      onFollowChange?.(false);
      toast({ title: "フォローを解除しました", status: "success" });
    },
    onError: error => {
      toast({ title: "フォローの操作に失敗しました", status: "error", description: error.message });
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit: SubmitHandler<{}> = async () => {
    if (!isLoggedIn) {
      onNotLoggedInModalOpen();
      return;
    }

    if (isFollowing) {
      await deleteFollow({
        variables: { userId: String(userId) },
      });
    } else {
      await createFollow({
        variables: { userId: String(userId) },
      });
    }
  };

  return (
    <>
      {!isMe && (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Button
              type="submit"
              isLoading={isSubmitting}
              colorScheme={isFollowing ? "gray" : "teal"}
              variant={variant}
              size={size}>
              {isFollowing ? "フォロー中" : "フォロー"}
            </Button>
          </form>

          <NotLoggedInModal isOpen={isNotLoggedInModalOpen} onClose={onNotLoggedInModalClose} />
        </>
      )}
    </>
  );
}
