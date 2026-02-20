"use client";

import { AttachmentIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Circle,
  FormControl,
  FormErrorMessage,
  Image,
  Input,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@apollo/client/react";
import {
  UpdateUserInput,
  UpdateUserProfileMutation,
  UpdateUserProfileMutationVariables,
  UpdateUserProfileDocument,
  User,
} from "@/src/generated/graphql";

type Props = {
  user: User;
  onUpdated?: () => void;
};

type ProfileEditFormInputs = UpdateUserInput;

export default function ProfileEditForm({ user, onUpdated }: Props) {
  const toast = useToast();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const previousImageUrlRef = useRef<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const [updateUser] = useMutation<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>(
    UpdateUserProfileDocument,
    {
      onCompleted: () => {
        onUpdated?.();

        toast({
          title: "プロフィールを更新しました",
          status: "success",
        });
      },
      onError: error => {
        toast({
          title: "プロフィールの更新に失敗しました",
          description: error.message,
          status: "error",
        });
      },
    },
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProfileEditFormInputs>({
    defaultValues: {
      name: user?.name,
      profileText: user?.profileText || "",
      avatar: null,
    },
  });

  const onSubmit: SubmitHandler<ProfileEditFormInputs> = async formData => {
    await updateUser({
      variables: {
        input: {
          name: formData.name,
          profileText: formData.profileText,
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
      <VStack align="stretch">
        <VStack>
          <Circle size="200" overflow="hidden" borderWidth="3px" borderColor="secondary.200">
            <Image
              src={imageUrl || user?.avatarUrl || "/no-image.webp"}
              alt={user?.name}
              w="full"
              h="full"
              objectFit="cover"
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
          <Input
            type="text"
            placeholder={user?.name}
            fontSize="xl"
            w="full"
            h="fit-content"
            {...register("name")}
            isDisabled={isSubmitting}
          />
          <FormErrorMessage color="red.200">{errors.name?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={Boolean(errors.profileText)}>
          <Textarea
            isInvalid={Boolean(errors.profileText)}
            placeholder="自己紹介を入力してください（500文字まで）"
            defaultValue={user?.profileText || ""}
            resize="vertical"
            rows={5}
            fontSize="sm"
            {...register("profileText")}
            isDisabled={isSubmitting}
          />
          <FormErrorMessage color="red.200">{errors.profileText?.message}</FormErrorMessage>
        </FormControl>

        <Box w="full" textAlign="right">
          <Button type="submit" colorScheme="pink" isLoading={isSubmitting}>
            送信
          </Button>
        </Box>
      </VStack>
    </form>
  );
}
