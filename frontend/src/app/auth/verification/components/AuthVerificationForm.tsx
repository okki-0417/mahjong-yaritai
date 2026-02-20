"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { VerifyAuthDocument } from "@/src/generated/graphql";
import useGetSession from "@/src/hooks/useGetSession";

type AuthVerificationFormData = {
  token: string;
};

export default function AuthVerificationForm() {
  const router = useRouter();
  const toast = useToast();
  const { updateSession } = useGetSession();

  const [verifyAuth] = useMutation(VerifyAuthDocument, {
    onCompleted: async data => {
      await updateSession();

      if (data.verifyAuth?.user) {
        toast({
          status: "success",
          title: "認証が完了しました",
        });
        router.push("/me");
      } else {
        toast({
          status: "success",
          title: "認証が完了しました",
          description: "新しくアカウントを作成してください",
        });
        router.push("/users/new");
      }
    },
    onError: error => {
      toast({
        status: "error",
        title: "認証に失敗しました",
        description: error.message,
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthVerificationFormData>();

  const onSubmit: SubmitHandler<AuthVerificationFormData> = async (
    formData: AuthVerificationFormData,
  ) => {
    await verifyAuth({
      variables: {
        input: {
          token: formData.token,
        },
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack align="start" spacing={4}>
        <FormControl isInvalid={Boolean(errors.token)} isRequired>
          <FormLabel htmlFor="token">認証コード</FormLabel>
          <Input
            type="text"
            letterSpacing="0.3rem"
            fontSize="xl"
            placeholder="認証コード（例：123456）"
            {...register("token", { required: "認証コードは必須です" })}
          />
          <FormErrorMessage>{errors.token?.message}</FormErrorMessage>
        </FormControl>

        <Button type="submit" isLoading={isSubmitting} colorScheme="pink" size="lg">
          認証を完了する
        </Button>
      </VStack>
    </form>
  );
}
