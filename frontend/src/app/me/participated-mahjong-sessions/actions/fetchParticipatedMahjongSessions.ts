"use server";

import type { PageInfo, ParticipatedMahjongSessionsQuery } from "@/src/generated/graphql";
import { ParticipatedMahjongSessionsDocument } from "@/src/generated/graphql";
import { getClient } from "@/src/lib/apollo/server";

type Props = {
  pageInfo: PageInfo | null;
};

type ReturnType = {
  mahjongSessions: ParticipatedMahjongSessionsQuery["participatedMahjongSessions"]["edges"][0]["node"][];
  pageInfo: PageInfo;
};

export default async function fetchParticipatedMahjongSessions({
  pageInfo,
}: Props): Promise<ReturnType> {
  if (pageInfo && !pageInfo.hasNextPage) {
    throw new Error("これ以上参加した麻雀セッションは存在しません");
  }

  const client = getClient();

  const { data, error } = await client.query({
    query: ParticipatedMahjongSessionsDocument,
    variables: {
      after: pageInfo?.endCursor ?? null,
      first: 10,
    },
    fetchPolicy: "network-only",
  });

  if (error) {
    throw new Error(error.message || "参加した麻雀セッションの取得に失敗しました");
  }

  const mahjongSessions = data.participatedMahjongSessions.edges.map(edge => edge.node);

  return {
    mahjongSessions,
    pageInfo: data.participatedMahjongSessions.pageInfo,
  };
}
