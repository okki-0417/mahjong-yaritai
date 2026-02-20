"use client";

import { Box, Button, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { WithdrawUserDocument, WithdrawUserMutation } from "@/src/generated/graphql";
import Link from "next/link";
import useGetSession from "@/src/hooks/useGetSession";
import { useForm } from "react-hook-form";

export default function WithdrawForm() {
  const router = useRouter();
  const toast = useToast();
  const { updateSession } = useGetSession();

  const [withdrawUser] = useMutation<WithdrawUserMutation>(WithdrawUserDocument, {
    onCompleted: async () => {
      await updateSession();

      toast({
        title: "退会が完了しました",
        description: "ご利用ありがとうございました。",
        status: "success",
      });
      router.push("/");
    },
    onError: error => {
      toast({
        title: "退会に失敗しました",
        description: error.message,
        status: "error",
      });
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async () => {
    const isConfirmed = confirm(
      `本当に退会しますか？\n\n退会すると、アカウントに関連するすべてのデータが削除されます。\nこの操作は取り消すことができません。`,
    );

    if (!isConfirmed) return;

    await withdrawUser();
  };

  return (
    <Box display="flex" gap={4}>
      <Link href="/me/profile">
        <Button colorScheme="gray">キャンセル</Button>
      </Link>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Button type="submit" isLoading={isSubmitting} colorScheme="red">
          退会する
        </Button>
      </form>
    </Box>
  );
}
