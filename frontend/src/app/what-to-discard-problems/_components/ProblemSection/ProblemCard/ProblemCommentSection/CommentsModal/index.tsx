"use client";

import CommentForm from "@/src/app/what-to-discard-problems/_components/ProblemSection/ProblemCard/ProblemCommentSection/CommentsModal/CommentForm";
import { Comment } from "@/src/generated/graphql";
import ParentCommentCard from "@/src/components/CommentCard/ParentCommentCard";
import { useRef } from "react";
import Modal from "@/src/components/Modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  parentComments: Comment[];
  problemId: string;
  /* eslint-disable-next-line no-unused-vars */
  onReply: (comment: Comment) => void;
  replyingToComment: Comment | null;
  onReplyCancel: () => void;
  /* eslint-disable-next-line no-unused-vars */
  onCommentCreate: (comment: Comment) => void;
};

export default function CommentsModal({
  isOpen,
  onClose,
  parentComments,
  problemId,
  onReply,
  replyingToComment,
  onReplyCancel,
  onCommentCreate,
}: Props) {
  const commentsTopRef = useRef<HTMLDivElement>(null);

  const wrappedOnCommentCreate = (comment: Comment) => {
    onCommentCreate(comment);

    setTimeout(() => {
      commentsTopRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Box minH={30} ref={commentsTopRef}>
        {parentComments.length > 0 ? (
          <VStack divider={<StackDivider />} gap="0">
            {parentComments.map((parentComment) => {
              return (
                <ParentCommentCard
                  key={parentComment.id}
                  comment={parentComment}
                  onReply={onReply}
                  commentableType="WhatToDiscardProblem"
                  commentableId={problemId}
                />
              );
            })}
          </VStack>
        ) : (
          <Text textAlign="center" fontSize="lg" fontWeight="bold">
            コメントはまだありません
          </Text>
        )}
      </Box>
    </Modal>
  );
}
