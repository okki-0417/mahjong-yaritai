"use server";

import { MutualFollowersDocument, MutualFollowersQuery, PageInfo } from "@/src/generated/graphql";
import { getClient } from "@/src/lib/apollo/server";

type Props = {
  pageInfo: PageInfo | null;
};

export type FetchMutualFollowersActionResponse = {
  mutualFollowersData: MutualFollowersQuery["mutualFollowers"]["edges"][0]["node"][];
  pageInfoData: MutualFollowersQuery["mutualFollowers"]["pageInfo"];
};

export default async function fetchMutualFollowersAction({
  pageInfo,
}: Props): Promise<FetchMutualFollowersActionResponse> {
  const client = getClient();

  const { data, error } = await client.query({
    query: MutualFollowersDocument,
    variables: { first: 15, after: pageInfo?.endCursor || null },
  });

  if (error) {
    throw new Error(error.message || "相互フォロワーの取得に失敗しました");
  }

  const mutualFollowers = data.mutualFollowers.edges.map(edge => edge.node);

  return {
    mutualFollowersData: mutualFollowers,
    pageInfoData: data.mutualFollowers.pageInfo,
  };
}
