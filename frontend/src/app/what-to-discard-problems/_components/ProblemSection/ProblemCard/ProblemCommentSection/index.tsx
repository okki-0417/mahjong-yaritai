"use client";

import { FaRegComment } from "react-icons/fa";
import PopButton from "@/src/components/PopButton";
import { memo, useCallback, useState, useTransition } from "react";
import useToast from "@/src/hooks/useToast";
import { useDisclosure } from "@/src/hooks/useDisclosure";
import Modal from "@/src/components/Modal";
import CommentForm from "@/src/app/what-to-discard-problems/_components/ProblemSection/ProblemCard/ProblemCommentSection/CommentsModal/CommentForm";
import ParentCommentCard from "@/src/components/CommentCard/ParentCommentCard";
import getWhatToDiscardProblemCommentsAction from "@/src/actions/getWhatToDiscardProblemCommentsAction";
import { Comment, ParentComment } from "@/src/types/components";

type Props = {
  initialCommentsCount: number;
  problemId: number;
};

const ProblemCommentSection = ({ problemId, initialCommentsCount }: Props) => {
  const [parentComments, setParentComments] = useState<ParentComment[]>([]);
  const [commentsCount, setCommentsCount] = useState(initialCommentsCount);
  const [replyingToComment, setReplyingToComment] =
    useState<ParentComment | null>(null);

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<Error | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const onReply = useCallback((comment: ParentComment) => {
    const isReplyingToChildComment = Boolean(comment.parent_comment_id);

    if (isReplyingToChildComment) {
      const parentComment = parentComments.find(
        (parent) => parent.id === comment.parent_comment_id,
      );
      setReplyingToComment(parentComment || null);
    } else {
      setReplyingToComment(comment);
    }
  }, []);

  const onReplyCancel = useCallback(() => {
    setReplyingToComment(null);
  }, []);

  const onCommentCreate = useCallback(
    (newComment: Comment | ParentComment) => {
      setReplyingToComment(null);

      if (newComment.parent_comment_id) {
        const newChildComment = newComment as Comment;

        const repliedComment = parentComments.find(
          (parentComment) => newComment.parent_comment_id === parentComment.id,
        );

        if (repliedComment) {
          repliedComment.child_comments = [
            newChildComment,
            ...repliedComment.child_comments,
          ];
        }
      } else {
        const newParentComment = {
          ...newComment,
          child_comments: [],
        } as ParentComment;

        setParentComments((prevComments) => [
          newParentComment,
          ...prevComments,
        ]);
      }

      setCommentsCount((prevCount) => prevCount + 1);
      toast({
        status: "success",
        title: "コメントを投稿しました",
      });
    },
    [parentComments],
  );

  const handleModalOpen = async () => {
    try {
      onOpen();

      startTransition(async () => {
        const comments = await getWhatToDiscardProblemCommentsAction(problemId);

        const parentComments = comments.map((parentComment) => {
          return {
            ...parentComment,
            child_comments: [],
          };
        });
        setParentComments(parentComments);
      });
    } catch (error) {
      console.error("Failed to fetch comments:", error);

      setError(
        error instanceof Error
          ? error
          : new Error("予想外なエラーが発生しました"),
      );
    }
  };

  return (
    <>
      <PopButton onClick={handleModalOpen}>
        <div className="flex gap-1">
          <FaRegComment color="#333" size={24} />

          <div className="font-sans font-bold">{commentsCount}</div>
        </div>
      </PopButton>

      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <div className="h-full flex flex-col divide-y-2">
            <div className="basis-full grow-0 overflow-scroll">
              {isPending ? (
                <div className="text-center text-lg">Loading...</div>
              ) : error ? (
                <div className="text-center text-lg font-bold text-red-500">
                  {error.message}
                </div>
              ) : (
                <>
                  {parentComments.length > 0 ? (
                    <div className="flex flex-col divide-y">
                      {parentComments.map((parentComment) => {
                        return (
                          <ParentCommentCard
                            key={parentComment.id}
                            parentComment={parentComment}
                            onReply={onReply}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-center text-lg font-bold">
                      コメントはまだありません
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="mt-2">
              <CommentForm
                problemId={problemId}
                replyingToComment={replyingToComment}
                onReplyCancel={onReplyCancel}
                onCommentCreate={(comment: Comment) => onCommentCreate(comment)}
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default memo(ProblemCommentSection);
