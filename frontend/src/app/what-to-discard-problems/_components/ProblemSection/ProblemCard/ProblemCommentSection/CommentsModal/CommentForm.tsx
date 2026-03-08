"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import createWhatToDiscardProblemCommentAction from "@/src/actions/createWhatToDiscardProblemCommentAction";
import { Comment } from "@/src/types/components";
import { CreateWhatToDiscardProblemCommentForm } from "@/src/types/forms";
import useToast from "@/src/hooks/useToast";
import useMe from "@/src/hooks/useMe";
import { useDisclosure } from "@/src/hooks/useDisclosure";
import Modal from "@/src/components/Modal";

type Props = {
  problemId: number;
  replyingToComment: Comment | null;
  onReplyCancel: () => void;
  onCommentCreate: (comment: Comment) => void;
  isFocused?: boolean;
};

export default function CommentForm({
  problemId,
  replyingToComment,
  onReplyCancel,
  onCommentCreate,
}: Props) {
  const isReplying = Boolean(replyingToComment);
  const { isLoggedIn } = useMe();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSubmit: SubmitHandler<CreateWhatToDiscardProblemCommentForm> = async (
    formData,
  ) => {
    try {
      const comment: Comment = await createWhatToDiscardProblemCommentAction({
        problemId,
        formData,
      });

      reset();
      onReplyCancel();
      onClose();
      onCommentCreate(comment);
    } catch (error) {
      toast({
        status: "error",
        title: "コメントの投稿に失敗しました",
        description:
          error instanceof Error
            ? error.message
            : "予期せぬエラーが発生しました",
      });
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setFocus,
    setValue,
    reset,
  } = useForm<CreateWhatToDiscardProblemCommentForm>({
    defaultValues: {
      parent_comment_id: replyingToComment
        ? replyingToComment.parent_comment_id || replyingToComment.id
        : null,
      content: "",
    },
  });

  useEffect(() => {
    if (isReplying) {
      setFocus("content");
      setValue(
        "parent_comment_id",
        replyingToComment?.parent_comment_id || replyingToComment?.id,
      );
    } else {
      setValue("parent_comment_id", null);
    }
  }, [isReplying]);

  return (
    <div className="w-full text-primary">
      {isLoggedIn ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-stretch">
            {replyingToComment && (
              <button
                onClick={onReplyCancel}
                className="flex items-center justify-between hover:bg-slate-100 rounded-sm px-2 py-1"
              >
                <p className="italic text-blue-500">
                  @{replyingToComment.user.name}
                </p>
                <IoMdClose />
              </button>
            )}

            <div>
              <input type="hidden" {...register("parent_comment_id")} />
              <span>{errors.parent_comment_id?.message}</span>
            </div>

            <div>
              <textarea
                className="p-2 text-primary w-full rounded-sm border"
                placeholder="コメントする..."
                rows={3}
                {...register("content", { required: true })}
              />
              <span>{errors.content?.message}</span>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                disabled={isSubmitting || !isValid}
                className={`bg-gray-500 text-white rounded-sm px-3 py-2 text-sm
                  ${isSubmitting || !isValid ? "opacity-50" : "bg-pink-500 hover:bg-pink-600"}`}
                onClick={onOpen}
              >
                投稿する
              </button>

              {isOpen && (
                <Modal
                  isOpen={isOpen}
                  onClose={onClose}
                  width="fit-content"
                  height="fit-content"
                >
                  <div className="p-4">
                    <p className="text-center">本当に投稿しますか？</p>
                    <div className="mt-6 flex justify-center gap-2">
                      <button
                        onClick={onClose}
                        className="bg-gray-500 text-white rounded-sm px-3 py-2"
                      >
                        キャンセル
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || !isValid}
                        className="bg-pink-500 hover:bg-pink-600 text-white rounded-sm px-3 py-2"
                      >
                        投稿する
                      </button>
                    </div>
                  </div>
                </Modal>
              )}
            </div>
          </div>
        </form>
      ) : (
        <div>
          <p className="text-center">
            コメントを投稿するにはログインしてください
          </p>
          <div className="text-center mt-2">
            <Link href="/auth/request">
              <button className="bg-pink-500 hover:bg-pink-600/90 text-white px-4 py-2 rounded-sm">
                ログイン / 新規登録する
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
