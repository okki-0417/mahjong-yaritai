"use client";

import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import CommentForm from "@/src/app/what-to-discard-problems/components/ProblemSection/ProblemCard/ProblemCommentSection/CommentsModal/CommentForm";
import { Comment } from "@/src/generated/graphql";
import ParentCommentCard from "@/src/components/CommentCard/ParentCommentCard";
import { useRef } from "react";

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
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl" scrollBehavior="inside">
      <ModalOverlay />

      <ModalContent overflow="hidden">
        <ModalHeader fontFamily="serif" className="bg-neutral text-primary">
          コメント
        </ModalHeader>

        <ModalCloseButton className="text-primary" />

        <ModalBody className="text-primary bg-neutral" fontFamily="serif">
          <Box minH={30} ref={commentsTopRef}>
            {parentComments.length > 0 ? (
              <VStack divider={<StackDivider />} gap="0">
                {parentComments.map(parentComment => {
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
        </ModalBody>

        <ModalFooter className="bg-neutral" boxShadow="0px -1px 10px 10px rgba(150,150,150,0.1)">
          <VStack w="full" gap="1">
            <CommentForm
              problemId={problemId}
              replyingToComment={replyingToComment}
              onReplyCancel={onReplyCancel}
              onCommentCreate={(comment: Comment) => wrappedOnCommentCreate(comment)}
            />
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
