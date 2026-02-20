"use client";

import fetchMutualFollowersAction, {
  FetchMutualFollowersActionResponse,
} from "@/src/app/me/participated-mahjong-sessions/new/actions/fetchMutualFollowersAction";
import { PageInfo } from "@/src/generated/graphql";
import useInfiniteScroll from "@/src/hooks/useInfiniteScroll";
import { useToast } from "@chakra-ui/react";
import { captureException } from "@sentry/nextjs";
import { Dispatch, SetStateAction } from "react";

type Props = {
  pageInfo: PageInfo | null;
  setMutualFollowers: Dispatch<
    SetStateAction<FetchMutualFollowersActionResponse["mutualFollowersData"]>
  >;
  setPageInfo: Dispatch<SetStateAction<FetchMutualFollowersActionResponse["pageInfoData"] | null>>;
};

export default function LoadMoreMutualFollowers({
  pageInfo,
  setMutualFollowers,
  setPageInfo,
}: Props) {
  const toast = useToast();

  const loadMoreMutualFollowers = async () => {
    if (!pageInfo?.hasNextPage) {
      return;
    }

    try {
      const { mutualFollowersData, pageInfoData } = await fetchMutualFollowersAction({
        pageInfo,
      });
      setMutualFollowers(prev => [...prev, ...mutualFollowersData]);
      setPageInfo(pageInfoData);
    } catch (error) {
      toast({
        title: "相互フォロワーの取得に失敗しました",
        status: "error",
        description: error instanceof Error ? error.message : "不明なエラーが発生しました",
      });
      captureException(error);
    }
  };

  const { targetRef, isPending } = useInfiniteScroll({ callback: loadMoreMutualFollowers });

  return <div ref={targetRef}>{isPending && <div>Loading more...</div>}</div>;
}
