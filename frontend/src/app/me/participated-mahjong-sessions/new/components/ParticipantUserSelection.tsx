"use client";

import fetchMutualFollowersAction, {
  FetchMutualFollowersActionResponse,
} from "@/src/app/me/participated-mahjong-sessions/new/actions/fetchMutualFollowersAction";
import LoadMoreMutualFollowers from "@/src/app/me/participated-mahjong-sessions/new/components/LoadMoreMutualFollowers";
import ParticipantUserCard from "@/src/app/me/participated-mahjong-sessions/new/components/ParticipantUserCard";
import { useMahjongSessionForm } from "@/src/app/me/participated-mahjong-sessions/new/contexts/MahjongSessionFormContextProvider";
import Fallback from "@/src/components/fallbacks/Fallback";
import useGetSession from "@/src/hooks/useGetSession";
import { Divider, Text, UnorderedList, useToast, VStack } from "@chakra-ui/react";
import { captureException } from "@sentry/nextjs";
import { useEffect, useState, useTransition } from "react";

type Props = {
  participantUserIndex: number;
  onClose: () => void;
};

export default function ParticipantUserSelection({ participantUserIndex, onClose }: Props) {
  const [isPending, startTransition] = useTransition();
  const [mutualFollowers, setMutualFollowers] = useState<
    FetchMutualFollowersActionResponse["mutualFollowersData"]
  >([]);
  const [pageInfo, setPageInfo] = useState<
    FetchMutualFollowersActionResponse["pageInfoData"] | null
  >(null);

  const { session } = useGetSession();
  const currentUser = session?.user;
  const { watch } = useMahjongSessionForm();
  const participantUsers = watch("participantUsers");
  const toast = useToast();

  // すでに追加されている参加者のuserIdを取得
  const addedUserIds = new Set(
    participantUsers.map(p => p.userId).filter((id): id is string => id !== null),
  );

  useEffect(() => {
    const fetchMutualFollowers = () => {
      startTransition(async () => {
        try {
          const { mutualFollowersData, pageInfoData } = await fetchMutualFollowersAction({
            pageInfo: null,
          });
          setMutualFollowers(mutualFollowersData);
          setPageInfo(pageInfoData);
        } catch (error) {
          toast({
            title: "相互フォロワーの取得に失敗しました",
            status: "error",
            description: error instanceof Error ? error.message : "不明なエラーが発生しました",
          });
          captureException(error);
        }
      });
    };

    fetchMutualFollowers();
  }, [toast]);

  // すでに追加されているユーザーを除外
  const filteredMutualFollowers = mutualFollowers.filter(user => !addedUserIds.has(user.id));

  // 自分がすでに追加されているかどうか
  const isCurrentUserAdded = currentUser ? addedUserIds.has(currentUser.id) : false;

  return (
    <UnorderedList listStyleType="none" marginInlineStart="0">
      {isPending ? (
        <Fallback />
      ) : (
        <VStack align="stretch" gap="1">
          {/* 自分を一番上に表示（まだ追加されていない場合のみ） */}
          {currentUser && !isCurrentUserAdded && (
            <>
              <Text fontSize="xs" color="gray.500" fontWeight="bold">
                自分
              </Text>
              <ParticipantUserCard
                key={currentUser.id}
                user={{
                  id: currentUser.id,
                  name: currentUser.name,
                  avatarUrl: currentUser.avatarUrl ?? null,
                }}
                participantUserIndex={participantUserIndex}
                onClose={onClose}
              />
              <Divider my="2" />
            </>
          )}
          {filteredMutualFollowers.length > 0 && (
            <Text fontSize="xs" color="gray.500" fontWeight="bold">
              相互フォロー
            </Text>
          )}
          {filteredMutualFollowers.map(user => (
            <ParticipantUserCard
              key={user.id}
              user={user}
              participantUserIndex={participantUserIndex}
              onClose={onClose}
            />
          ))}
          {pageInfo && pageInfo.hasNextPage && (
            <LoadMoreMutualFollowers
              pageInfo={pageInfo}
              setMutualFollowers={setMutualFollowers}
              setPageInfo={setPageInfo}
            />
          )}
        </VStack>
      )}
    </UnorderedList>
  );
}
