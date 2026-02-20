"use client";

import { Button, Grid, GridItem, Text, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { IoMdLogOut } from "react-icons/io";
import { useMutation } from "@apollo/client/react";
import { LogoutUserDocument, LogoutUserMutation } from "@/src/generated/graphql";
import { useForm } from "react-hook-form";
import useGetSession from "@/src/hooks/useGetSession";

export default function LogoutButton() {
  const toast = useToast();
  const router = useRouter();

  const { updateSession } = useGetSession();

  const {
    formState: { isSubmitting },
    handleSubmit,
  } = useForm();

  const [logoutUser] = useMutation<LogoutUserMutation>(LogoutUserDocument, {
    onCompleted: async () => {
      await updateSession();

      toast({
        title: "ログアウトしました。",
        status: "success",
      });
      router.push("/");
    },
    onError: error => {
      toast({
        title: "ログアウトに失敗しました。",
        description: error.message,
        status: "error",
      });
    },
  });

  const onSubmit = async () => {
    const isConfirmed = confirm("ログアウトしますか？");
    if (!isConfirmed) return;

    await logoutUser();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Button
        type="submit"
        colorScheme=""
        className="w-full py-3 px-4 rounded hover:bg-gray-600 transition-colors"
        isLoading={isSubmitting}>
        <Grid w="full" h="full" templateColumns="repeat(8, 1fr)">
          <GridItem colSpan={1}>
            <IoMdLogOut size={20} />
          </GridItem>
          <GridItem colSpan={7} textAlign="left">
            <Text>ログアウト</Text>
          </GridItem>
        </Grid>
      </Button>
    </form>
  );
}
