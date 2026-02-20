"use client";

import { Comment } from "@/src/generated/graphql";
import CommentCard from "@/src/components/CommentCard";
import { Box, HStack } from "@chakra-ui/react";

type Props = {
  reply: Comment;
  /* eslint-disable-next-line no-unused-vars */
  onReply: (comment: Comment) => void;
  commentableType: string;
  commentableId: string;
};

export default function ChildCommentCard({ reply, onReply }: Props) {
  return (
    <HStack alignItems="start" spacing="4" w="full">
      <Box borderLeft="2px" borderLeftColor="gray.500" w="full" pl="4">
        <CommentCard comment={reply} onReply={onReply} />
      </Box>
    </HStack>
  );
}
