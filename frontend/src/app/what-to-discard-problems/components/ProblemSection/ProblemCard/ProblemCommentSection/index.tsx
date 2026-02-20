"use client";

import { FaRegComment } from "react-icons/fa";
import PopButton from "@/src/components/PopButton";
import { HStack, Spinner, Text, useDisclosure, useToast } from "@chakra-ui/react";
import CommentsModal from "@/src/app/what-to-discard-problems/components/ProblemSection/ProblemCard/ProblemCommentSection/CommentsModal";
import { Comment, ParentCommentsDocument } from "@/src/generated/graphql";
import { Fragment, useState } from "react";
import { useLazyQuery } from "@apollo/client/react";
import { clearQueryCache } from "@/src/lib/apollo/cache";

type Props = {
  initialCommentsCount: number;
  problemId: string;
};

export default function ProblemCommentSection({ problemId, initialCommentsCount }: Props) {
  const [parentComments, setParentComments] = useState<Comment[]>([]);
  const [replyingToComment, setReplyingToComment] = useState<Comment | null>(null);

  const toast = useToast();
  const {
    isOpen: isCommentModalOpen,
    onOpen: onCommentModalOpen,
    onClose: onCommentModalClose,
  } = useDisclosure();

  const onReply = (comment: Comment) => setReplyingToComment(comment);
  const onReplyCancel = () => setReplyingToComment(null);
  const onCommentCreate = (comment: Comment) => {
    setReplyingToComment(null);

    const isReplyComment = Boolean(Number(comment.parentCommentId));

    if (isReplyComment) {
      const newComments = parentComments.map(prevComment => {
        if (prevComment.id == comment.parentCommentId) {
          prevComment.repliesCount++;
          return prevComment;
        } else {
          return prevComment;
        }
      });

      setParentComments(newComments);
      clearQueryCache("replies");
    } else {
      setParentComments(prevComments => [comment, ...prevComments]);
      clearQueryCache("comments");
    }
  };

  const [getComments, { loading: commentsLoading }] = useLazyQuery(ParentCommentsDocument);

  const handleModalOpen = async () => {
    if (commentsLoading) return;

    const result = await getComments({
      variables: { whatToDiscardProblemId: problemId },
    });

    if (result.error) {
      toast({
        status: "error",
        title: "コメントを取得できませんでした",
        description: result.error.message,
      });
    } else if (result.data?.whatToDiscardProblemComments) {
      setParentComments(result.data.whatToDiscardProblemComments.edges.map(edge => edge.node));
      onCommentModalOpen();
    }
  };

  return (
    <Fragment>
      <PopButton onClick={handleModalOpen}>
        <HStack gap="1">
          {commentsLoading ? <Spinner size="sm" /> : <FaRegComment color="#333" size={24} />}
          <Text fontFamily="sans-serif" fontWeight="bold">
            {parentComments.length || initialCommentsCount}
          </Text>
        </HStack>
      </PopButton>

      <CommentsModal
        isOpen={isCommentModalOpen}
        onClose={onCommentModalClose}
        parentComments={parentComments}
        problemId={problemId}
        onReply={onReply}
        replyingToComment={replyingToComment}
        onReplyCancel={onReplyCancel}
        onCommentCreate={(comment: Comment) => onCommentCreate(comment)}
      />
    </Fragment>
  );
}
