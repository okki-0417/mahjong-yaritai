"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
  Text,
  Box,
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import { RequestAuthDocument, RequestAuthInput } from "@/src/generated/graphql";
import { useMutation } from "@apollo/client/react";

type AuthRequestFormType = RequestAuthInput;

export default function AuthRequestForm() {
  const router = useRouter();
  const toast = useToast();

  const [requestAuth] = useMutation(RequestAuthDocument, {
    onCompleted: () => {
      toast({
        status: "success",
        title: "認証リクエストを送信しました",
        description: "確認メールを送信しました。メールを確認してください。",
      });
      router.push("/auth/verification");
    },
    onError: error => {
      toast({
        status: "error",
        title: "認証リクエストに失敗しました",
        description: error.message,
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthRequestFormType>();

  const onSubmit: SubmitHandler<AuthRequestFormType> = async (formData: AuthRequestFormType) => {
    await requestAuth({
      variables: {
        input: {
          ...formData,
        },
      },
    });
  };

  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold" w="full">
        メールアドレスでログイン/登録
      </Text>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-2">
        <VStack align="start" spacing={4}>
          <FormControl isInvalid={Boolean(errors.email)} isRequired>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              type="email"
              placeholder="test@mahjong-yaritai.com"
              autoComplete="email"
              {...register("email")}
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>

          <Text fontSize="sm">
            <Link href="/terms" className="text-blue-200 underline" target="_blank">
              利用規約
            </Link>
            と
            <Link href="/privacy" className="text-blue-200 underline" target="_blank">
              プライバシーポリシー
            </Link>
            に同意の上、ログイン/登録を行ってください。
          </Text>

          <Button type="submit" isLoading={isSubmitting} colorScheme="pink">
            確認メールを送信する
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
