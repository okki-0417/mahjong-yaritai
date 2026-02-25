"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import Modal from "@/src/components/Modal";
import { FollowableUser } from "@/src/types/components";
import FollowButton from "@/src/components/FollowButton";
import fetchUserAction from "@/src/actions/fetchUserAction";
import { fetchMeAction } from "@/src/actions/fetchMeAction";

type Props = {
  userId: string | number;
  isOpen: boolean;
  onClose: () => void;
};

export default function UserModal({ userId, isOpen, onClose }: Props) {
  const [myUserId, setMyUserId] = useState<number | string | null>(null);
  const [userProfile, setUserProfile] = useState<FollowableUser | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchUsers = useCallback(async () => {
    const [userResult, meResult] = await Promise.all([
      fetchUserAction(userId),
      fetchMeAction(),
    ]);

    if (userResult.errors) {
      console.error("ユーザの情報の取得に失敗:", userResult.errors);
      return;
    }
    if (meResult.errors) {
      console.error("自分の情報の取得に失敗:", meResult.errors);
      return;
    }

    setUserProfile(userResult.data);
    setMyUserId(meResult.data?.id || null);
  }, [userId]);

  useEffect(() => {
    if (isOpen) {
      startTransition(() => {
        fetchUsers();
      });
    }
  }, [isOpen, fetchUsers]);

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

          {myUserId &&
            userProfile &&
            Number(myUserId) !== Number(userProfile.id) && (
              <div className="mt-4 flex justify-center">
                <FollowButton
                  userId={userProfile.id}
                  initialIsFollowing={userProfile.is_followed_by_me}
                />
              </div>
            )}
        </div>
      )}
    </Modal>
  );
}
