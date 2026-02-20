"use client";

import FollowStatsList from "@/src/components/Modals/FollowStatsModal/FollowStatsList";
import LoadingFollows from "@/src/components/Modals/FollowStatsModal/LoadingFollows";
import { FollowersDocument, FollowingDocument, User } from "@/src/generated/graphql";
import { useLazyQuery } from "@apollo/client/react";
import { Tab, TabList, TabPanel, TabPanels, Tabs, useToast } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

type Followings = User[];
type Followers = User[];

type Props = {
  defaultIndex: number;
};

export default function FollowStatsTabs({ defaultIndex }: Props) {
  const [tabIndex, setTabIndex] = useState(defaultIndex);
  const [followings, setFollowings] = useState<Followings>([]);
  const [followers, setFollowers] = useState<Followers>([]);

  const [getFollowings, { loading: followingsLoading }] = useLazyQuery(FollowingDocument);
  const [getFollowers, { loading: followersLoading }] = useLazyQuery(FollowersDocument);

  const toast = useToast();

  const loadFollowings = useCallback(async () => {
    const { data, error } = await getFollowings();

    if (error) {
      toast({
        title: "フォロー一覧の取得に失敗しました",
        description: error.message,
        status: "error",
      });
      return;
    }

    if (data) {
      const followingsData = data.followings.edges.map(edge => edge.node);
      setFollowings(followingsData);
    }
  }, [getFollowings, toast]);

  const loadFollowers = useCallback(async () => {
    const { data, error } = await getFollowers();

    if (error) {
      toast({
        title: "フォロワー一覧の取得に失敗しました",
        description: error.message,
        status: "error",
      });
      return;
    }

    if (data) {
      const followersData = data.followers.edges.map(edge => edge.node);
      setFollowers(followersData);
    }
  }, [getFollowers, toast]);

  useEffect(() => {
    const getFollows = async (index: number) => {
      if (index === 0) {
        await loadFollowings();
      } else {
        await loadFollowers();
      }
    };

    getFollows(tabIndex);
  }, [tabIndex, loadFollowings, loadFollowers]);

  return (
    <Tabs defaultIndex={defaultIndex}>
      <TabList color="secondary.500" fontWeight="bold">
        <Tab onClick={() => setTabIndex(0)}>フォロー</Tab>
        <Tab onClick={() => setTabIndex(1)}>フォロワー</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          {followingsLoading ? <LoadingFollows /> : <FollowStatsList users={followings} />}
        </TabPanel>
        <TabPanel>
          {followersLoading ? <LoadingFollows /> : <FollowStatsList users={followers} />}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
