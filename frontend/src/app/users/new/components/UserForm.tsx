"use client";

import { AttachmentIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Circle,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Input,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@apollo/client/react";
import {
  CreateUserDocument,
  CreateUserInput,
  CreateUserMutation,
  CreateUserMutationVariables,
} from "@/src/generated/graphql";
import useGetSession from "@/src/hooks/useGetSession";

type UserFormData = CreateUserInput;

export default function UserForm() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const previousImageUrlRef = useRef<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const toast = useToast();

  const router = useRouter();
  const { updateSession } = useGetSession();

  const [createUser] = useMutation<CreateUserMutation, CreateUserMutationVariables>(
    CreateUserDocument,
    {
      onCompleted: async () => {
        await updateSession();

        toast({
          status: "success",
          title: "ユーザーを作成しました",
        });
        router.push("/me");
      },
      onError: error => {
        toast({
          status: "error",
          title: "ユーザーの作成に失敗しました",
          description: error.message,
        });
      },
    },
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>();

  const onSubmit: SubmitHandler<UserFormData> = async formData => {
    await createUser({
      variables: {
        input: {
          name: formData.name,
          profileText: "",
          avatar: formData.avatar || undefined,
        },
      },
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files?.length) return null;

    if (previousImageUrlRef.current) {
      URL.revokeObjectURL(previousImageUrlRef.current);
    }

    const url = URL.createObjectURL(files[0]);
    previousImageUrlRef.current = url;

    setImageUrl(url);

    return files[0];
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack align="stretch" gap="4">
        <VStack>
          <Circle size="200" overflow="hidden">
            <Image
              src={imageUrl || "/no-image.webp"}
              w="full"
              h="full"
              objectFit="cover"
              draggable="false"
              bgColor="white"
            />
          </Circle>
          <Button onClick={() => imageInputRef.current?.click()}>
            <AttachmentIcon />
          </Button>
        </VStack>

        <FormControl isInvalid={Boolean(errors.avatar)}>
          <Controller
            control={control}
            name="avatar"
            render={({ field: { onChange, ref } }) => (
              <Input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                ref={element => {
                  ref(element);
                  imageInputRef.current = element;
                }}
                onChange={event => {
                  const file = handleFileChange(event);
                  onChange(file);
                }}
                display="none"
              />
            )}
          />
          <FormErrorMessage>
            {errors.avatar?.message ? String(errors.avatar?.message) : ""}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={Boolean(errors.name)}>
          <FormLabel>ニックネーム</FormLabel>
          <Input
            type="text"
            placeholder="ニックネーム"
            size="md"
            {...register("name", { required: "ニックネームは必須です" })}
            isDisabled={isSubmitting}
          />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>

        <Box w="full" textAlign="right">
          <Button type="submit" colorScheme="pink" isLoading={isSubmitting}>
            ユーザー作成
          </Button>
        </Box>
      </VStack>
    </form>
  );
}
