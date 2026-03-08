"use client";

import { Comment } from "@/src/generated/graphql";
import { Button, HStack, Text, useToast } from "@chakra-ui/react";
import { useLazyQuery } from "@apollo/client/react";
import { CommentRepliesDocument } from "@/src/generated/graphql";
import { FaRegComment } from "react-icons/fa6";

type Props = {
  parentComment: Comment;
  onRepliesFetched: (replies: Comment[]) => void;
};

export default function FetchRepliesButton({
  parentComment,
  onRepliesFetched,
}: Props) {
  const [fetchReplies, { loading }] = useLazyQuery(CommentRepliesDocument);

  const toast = useToast();

  const handleFetchReplies = async () => {
    if (loading) return;

    // const result = await fetchReplies({
    //   variables: {
    //     problemId: parentComment.commentableId,
    //     parentCommentId: parentComment.id,
    //   },
    // });

    // if (result.error) {
    //   toast({
    //     status: "error",
    //     title: "返信を取得できませんでした",
    //     description: result.error.message,
    //   });
    //   return;
    // }

    // if (result.data?.whatToDiscardProblemCommentReplies) {
    //   onRepliesFetched(
    //     result.data.whatToDiscardProblemCommentReplies.edges.map(
    //       (edge) => edge.node,
    //     ),
    //   );
    // }
  };

  return (
    <Button
      onClick={handleFetchReplies}
      isLoading={loading}
      variant="ghost"
      size="sm"
      px="1"
      mx="0"
    >
      <HStack gap="1">
        <FaRegComment size={20} />
        <Text fontSize="md" fontFamily="sans-serif" fontWeight="bold">
          {parentComment.repliesCount}
        </Text>
      </HStack>
    </Button>
  );
}
