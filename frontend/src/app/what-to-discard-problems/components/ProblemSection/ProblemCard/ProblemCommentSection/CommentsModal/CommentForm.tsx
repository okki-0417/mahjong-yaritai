"use client";

import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  HStack,
  Text,
  Textarea,
  useToast,
  VisuallyHiddenInput,
  VStack,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import { useMutation } from "@apollo/client/react";
import {
  CreateCommentDocument,
  Comment,
  CreateWhatToDiscardProblemCommentInput,
} from "@/src/generated/graphql";
import useGetSession from "@/src/hooks/useGetSession";
import { useEffect } from "react";
import { IoMdClose } from "react-icons/io";

type CommentCreateFormInputs = CreateWhatToDiscardProblemCommentInput;

type Props = {
  problemId: string;
  replyingToComment: Comment | null;
  onReplyCancel: () => void;
  /* eslint-disable-next-line no-unused-vars */
  onCommentCreate: (comment: Comment) => void;
  isFocused?: boolean;
};

export default function CommentForm({
  problemId,
  replyingToComment,
  onReplyCancel,
  onCommentCreate,
}: Props) {
  const { session } = useGetSession();
  const isLoggedIn = Boolean(session?.isLoggedIn);

  const toast = useToast();

  const [createComment] = useMutation(CreateCommentDocument, {
    onCompleted: data => {
      toast({
        status: "success",
        title: "コメントを投稿しました",
      });

      resetForm();
      onCommentCreate(data.createWhatToDiscardProblemComment.comment);
    },
    onError: error => {
      toast({
        status: "error",
        title: "コメントの投稿に失敗しました",
        description: error.message,
      });
    },
  });

  const onSubmit: SubmitHandler<CommentCreateFormInputs> = async formData => {
    await createComment({
      variables: {
        whatToDiscardProblemId: problemId,
        ...formData,
      },
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setFocus,
    setValue,
    reset: resetForm,
  } = useForm<CommentCreateFormInputs>({
    defaultValues: {
      parentCommentId: replyingToComment
        ? String(Number(replyingToComment.parentCommentId) || replyingToComment.id)
        : undefined,
      content: "",
    },
  });

  useEffect(() => {
    if (replyingToComment) {
      setFocus("content");
      setValue(
        "parentCommentId",
        String(Number(replyingToComment.parentCommentId) || replyingToComment.id),
      );
    } else {
      setValue("parentCommentId", null);
    }
  }, [replyingToComment, setFocus, setValue]);

  return (
    <Box w="full" fontFamily="serif" className="text-primary">
      {isLoggedIn ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack alignItems="stretch" gap="1">
            {replyingToComment && (
              <HStack justifyContent="space-between">
                <Text fontStyle="italic">@{replyingToComment.user.name}...</Text>
                <Button bgColor="inherit" size="xs" fontSize="sm" onClick={onReplyCancel}>
                  <IoMdClose />
                </Button>
              </HStack>
            )}

            <FormControl>
              <VisuallyHiddenInput {...register("parentCommentId")} />
              <FormErrorMessage>{errors.parentCommentId?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={Boolean(errors.content)}>
              <Textarea
                className="text-primary"
                placeholder="コメントする..."
                {...register("content", { required: true })}
              />
              <FormErrorMessage>{errors.content?.message}</FormErrorMessage>
            </FormControl>

            <HStack justifyContent="end">
              <Button
                type="submit"
                colorScheme="pink"
                isLoading={isSubmitting}
                isDisabled={!isValid}>
                送信
              </Button>
            </HStack>
          </VStack>
        </form>
      ) : (
        <Container>
          <Text textAlign="center">コメントを投稿するにはログインしてください</Text>
          <Container textAlign="center" mt={2}>
            <Link href="/auth/request">
              <Button colorScheme="pink">ログイン / 新規登録する</Button>
            </Link>
          </Container>
        </Container>
      )}
    </Box>
  );
}
