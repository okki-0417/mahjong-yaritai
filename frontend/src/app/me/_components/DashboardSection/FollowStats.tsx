"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { IoMdPerson } from "react-icons/io";
import Modal from "@/src/components/Modal";
import { fetchFollowersAction } from "@/src/actions/fetchFollowersAction";
import { fetchFollowingsAction } from "@/src/actions/fetchFollowingsAction";
import { User } from "@/src/types/components";
import { useDisclosure } from "@/src/hooks/useDisclosure";

type Props = {
  userId: number;
  followingCount: number;
  followersCount: number;
};

export default function FollowStats({
  userId,
  followingCount,
  followersCount,
}: Props) {
  const [tab, setTab] = useState<"followings" | "followers">("followings");
  const [followers, setFollowers] = useState<User[]>([]);
  const [followings, setFollowings] = useState<User[]>([]);
  const [isPending, startTransition] = useTransition();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const loadData = useCallback(() => {
    startTransition(async () => {
      const [followersResult, followingsResult] = await Promise.all([
        fetchFollowersAction(userId),
        fetchFollowingsAction(userId),
      ]);
      setFollowers(followersResult.data);
      setFollowings(followingsResult.data);
    });
  }, [userId]);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, loadData]);

  const openWithTab = (selectedTab: "followings" | "followers") => {
    setTab(selectedTab);
    onOpen();
  };

  const currentList = tab === "followers" ? followers : followings;

  return (
    <>
      <div className="flex justify-center gap-2">
        <button
          onClick={() => openWithTab("followings")}
          className="p-2 rounded-sm border hover:bg-secondary-light"
        >
          <div className="flex items-center gap-1">
            <IoMdPerson size={20} color="white" />
            <p className="text-sm">フォロー：{followingCount}</p>
          </div>
        </button>

        <button
          onClick={() => openWithTab("followers")}
          className="p-2 rounded-sm border hover:bg-secondary-light"
        >
          <div className="flex items-center gap-1">
            <IoMdPerson size={20} color="white" />
            <p className="text-sm">フォロワー：{followersCount}</p>
          </div>
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <div>
          <div className="flex border-b">
            <button
              onClick={() => setTab("followings")}
              className={`flex-1 py-2 ${tab === "followings" ? "border-b-2 border-blue-500 font-bold" : "hover:bg-gray-100"}`}
            >
              フォロー
            </button>
            <button
              onClick={() => setTab("followers")}
              className={`flex-1 py-2 ${tab === "followers" ? "border-b-2 border-blue-500 font-bold" : "hover:bg-gray-100"}`}
            >
              フォロワー
            </button>
          </div>

          <div className="mt-4 max-h-80 overflow-y-auto">
            {isPending ? (
              <div className="text-center py-4">読み込み中...</div>
            ) : currentList.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                {tab === "followers"
                  ? "フォロワーはいません"
                  : "フォロー中のユーザーはいません"}
              </div>
            ) : (
              <ul className="divide-y">
                {currentList.map((user) => (
                  <li key={user.id} className="flex items-center gap-3 p-3">
                    <div className="size-10 rounded-full overflow-hidden bg-gray-200 border-2">
                      <img
                        src={user.avatar_url || "/no-image.webp"}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
