"use client";

import { useState, useTransition } from "react";
import { Comment, ParentComment } from "@/src/types/components";
import CommentCard from "@/src/components/CommentCard";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import getWhatToDiscardProblemReplies from "@/src/actions/getWhatToDiscardProblemReplies";
import useToast from "@/src/hooks/useToast";

type Props = {
  parentComment: ParentComment;
  onReply: (comment: ParentComment) => void;
};

export default function ParentCommentCard({ parentComment, onReply }: Props) {
  const [isPending, startTransition] = useTransition();

  const [isShowingReplies, setIsShowingReplies] = useState(false);
  const toast = useToast();

  const fetchReplies = () => {
    startTransition(async () => {
      try {
        const replies: Comment[] = await getWhatToDiscardProblemReplies({
          problemId: parentComment.commentable_id,
          commentId: parentComment.id,
        });

        parentComment.child_comments = replies;
        setIsShowingReplies(true);
      } catch (error) {
        console.error("返信の取得に失敗しました", error);
        toast({
          status: "error",
          title: "返信の取得に失敗しました",
          description:
            error instanceof Error
              ? error.message
              : "予期せぬエラーが発生しました",
        });
      }
    });
  };

  return (
    <div className="w-full">
      <CommentCard comment={parentComment} onReply={onReply} />

      {isShowingReplies ? (
        <div>
          <div className="flex flex-col pl-8 items-stretch divide-y">
            {parentComment.child_comments.map((childComment) => (
              <div key={childComment.id} className="border-l">
                <CommentCard comment={childComment} onReply={onReply} />
              </div>
            ))}
          </div>

          <button
            className="px-2 py-1 font-xs flex items-center justify-end w-full hover:bg-slate-200 rounded-sm"
            onClick={() => setIsShowingReplies(false)}
          >
            <span className="text-xs">閉じる </span>
            <MdKeyboardArrowUp size={20} />
          </button>
        </div>
      ) : (
        <>
          {(parentComment.child_comments.length > 0 ||
            parentComment.replies_count > 0) && (
            <>
              {isPending ? (
                <div className="text-center text-sm text-gray-500">
                  Loading...
                </div>
              ) : (
                <button
                  onClick={fetchReplies}
                  className="-mt-2 px-2 py-1 w-full flex items-center justify-center text-xs hover:bg-slate-200 rounded-sm"
                >
                  <MdKeyboardArrowDown size={18} />
                  返信を見る
                </button>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
