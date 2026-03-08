"use client";

import { useState, useEffect, useTransition, memo } from "react";
import Modal from "@/src/components/Modal";
import { FollowableUser } from "@/src/types/components";
import FollowButton from "@/src/components/FollowButton";
import fetchUserAction from "@/src/actions/fetchUserAction";

type Props = {
  userId: number;
  meId?: number | null | undefined;
  isOpen: boolean;
  onClose: () => void;
};

const UserModal = ({ userId, meId, isOpen, onClose }: Props) => {
  const [userProfile, setUserProfile] = useState<FollowableUser | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!isOpen) {
      setUserProfile(null);
      return;
    }

    startTransition(async () => {
      const userResult = await fetchUserAction(userId);

      if (userResult.errors) {
        console.error("ユーザの情報の取得に失敗:", userResult.errors);
        return;
      }

      setUserProfile(userResult.data);
    });
  }, [isOpen, userId]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <p>ユーザー情報</p>

      {isPending ? (
        <p>読み込み中...</p>
      ) : (
        <div>
          <div className="mt-2 flex flex-col items-center gap-4">
            <div
              style={{
                backgroundImage: `url(${userProfile?.avatar_url || "/no-image.webp"})`,
              }}
              className="size-36 border-2 rounded-full bg-cover bg-center"
            />

            <p className="text-xl">{userProfile?.name}</p>

            {userProfile?.profile_text && (
              <p className="mt-2 text-sm line-clamp-10">
                {userProfile.profile_text}
              </p>
            )}
          </div>

          {meId && userProfile && Number(meId) !== Number(userProfile.id) && (
            <div className="mt-4 flex justify-center">
              <FollowButton
                meId={meId}
                userId={userProfile.id}
                initialIsFollowing={userProfile.is_followed_by_me}
              />
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default memo(UserModal);
