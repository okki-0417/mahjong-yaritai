"use client";

import CommentCard from "@/src/components/CommentCard";
import { Comment, ParentComment } from "@/src/types/components";

type Props = {
  childComment: Comment;
  onReply: (comment: ParentComment) => void;
};

export default function ChildCommentCard({ childComment, onReply }: Props) {
  return (
    <div className="flex items-start gap-4 w-full">
      <div className="border-l-2 border-gray-500 pl-4 w-full">
        <CommentCard comment={childComment} onReply={onReply} />
      </div>
    </div>
  );
}
