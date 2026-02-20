import { LogoutUserDocument, LogoutUserMutation } from "@/src/generated/graphql";
import useGetSession from "@/src/hooks/useGetSession";
import { useMutation } from "@apollo/client/react";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export const useLogout = () => {
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

  return {
    isSubmitting,
    onSubmit: handleSubmit(onSubmit),
  };
};
