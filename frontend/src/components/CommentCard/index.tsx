"use client";

import { MdOutlineReply } from "react-icons/md";
import UserModal from "@/src/components/Modals/UserModal";
import NotLoggedInModal from "@/src/components/Modals/NotLoggedInModal";
import { Comment, ParentComment } from "@/src/types/components";
import useMe from "@/src/hooks/useMe";
import { useDisclosure } from "@/src/hooks/useDisclosure";

type Props = {
  comment: Comment;
  onReply: (comment: ParentComment) => void;
};

export default function CommentCard({ comment, onReply }: Props) {
  const { isLoggedIn } = useMe();

  const {
    isOpen: isUserModalOpen,
    onOpen: onUserModalOpen,
    onClose: onUserModalClose,
  } = useDisclosure();

  const {
    isOpen: isNotLoggedInModalOpen,
    onOpen: onNotLoggedInModalOpen,
    onClose: onNotLoggedInModalClose,
  } = useDisclosure();

  const handleReplyClick = () => {
    if (!isLoggedIn) {
      onNotLoggedInModalOpen();
      return;
    }
    onReply(comment as ParentComment);
  };

  return (
    <>
      <div className="w-full p-2 rounded-sm">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onUserModalOpen}
            className="p-0 bg-transparent border-none cursor-pointer"
          >
            <div className="flex items-center gap-2 hover:bg-slate-200 rounded-sm pr-2">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300">
                <img
                  src={comment.user.avatar_url || "/no-image.webp"}
                  alt={comment.user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-primary">{comment.user.name}</span>
            </div>
          </button>

          <button
            type="button"
            onClick={handleReplyClick}
            className="p-1.5 bg-transparent border-none cursor-pointer hover:bg-slate-200 rounded-full hover:shadow"
          >
            <MdOutlineReply size={18} className="text-primary" />
          </button>
        </div>

        <p className="mt-1">{comment.content}</p>

        <div className="flex justify-end mt-1">
          <span className="font-sans text-xs text-secondary">
            {new Date(comment.created_at).toLocaleString()}
          </span>
        </div>
      </div>

      <NotLoggedInModal
        isOpen={isNotLoggedInModalOpen}
        onClose={onNotLoggedInModalClose}
      />
      <UserModal
        userId={comment.user.id}
        isOpen={isUserModalOpen}
        onClose={onUserModalClose}
      />
    </>
  );
}
