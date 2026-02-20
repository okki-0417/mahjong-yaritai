"use client";

import { Comment } from "@/src/generated/graphql";
import { Button, HStack, Text, useToast } from "@chakra-ui/react";
import { useLazyQuery } from "@apollo/client/react";
import { CommentRepliesDocument } from "@/src/generated/graphql";
import { FaRegComment } from "react-icons/fa6";

type Props = {
  parentComment: Comment;
  commentableType: string;
  commentableId: string;
  /* eslint-disable-next-line no-unused-vars */
  onRepliesFetched: (replies: Comment[]) => void;
};

export default function FetchRepliesButton({
  parentComment,
  // 今は何切る問題のコメントのみを想定しているが、
  // 将来的な拡張のために commentable形式で受け取るようにしている
  /* eslint-disable-next-line no-unused-vars */
  commentableType,
  commentableId,
  onRepliesFetched,
}: Props) {
  const [fetchReplies, { loading }] = useLazyQuery(CommentRepliesDocument);

  const toast = useToast();

  const handleFetchReplies = async () => {
    if (loading) return;

    const result = await fetchReplies({
      variables: {
        problemId: commentableId,
        parentCommentId: parentComment.id,
      },
    });

    if (result.error) {
      toast({
        status: "error",
        title: "返信を取得できませんでした",
        description: result.error.message,
      });
      return;
    }

    if (result.data?.whatToDiscardProblemCommentReplies) {
      onRepliesFetched(result.data.whatToDiscardProblemCommentReplies.edges.map(edge => edge.node));
    }
  };

  return (
    <Button
      onClick={handleFetchReplies}
      isLoading={loading}
      variant="ghost"
      size="sm"
      px="1"
      mx="0">
      <HStack gap="1">
        <FaRegComment size={20} />
        <Text fontSize="md" fontFamily="sans-serif" fontWeight="bold">
          {parentComment.repliesCount}
        </Text>
      </HStack>
    </Button>
  );
}
