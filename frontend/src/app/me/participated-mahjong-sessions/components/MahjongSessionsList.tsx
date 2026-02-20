"use client";

import fetchParticipatedMahjongSessions from "@/src/app/me/participated-mahjong-sessions/actions/fetchParticipatedMahjongSessions";
import MahjongSessionCard from "@/src/app/me/participated-mahjong-sessions/components/MahjongSessionCard";
import type { ParticipatedMahjongSessionsQuery } from "@/src/generated/graphql";
import { PageInfo } from "@/src/generated/graphql";
import useInfiniteScroll from "@/src/hooks/useInfiniteScroll";
import { Box, UnorderedList, useToast } from "@chakra-ui/react";
import { captureException } from "@sentry/nextjs";
import { useCallback, useRef, useState } from "react";

type Session = ParticipatedMahjongSessionsQuery["participatedMahjongSessions"]["edges"][0]["node"];

type Props = {
  initialSessions: Session[];
  initialPageInfo: PageInfo;
};

export default function MahjongSessionsList({ initialSessions, initialPageInfo }: Props) {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [pageInfo, setPageInfo] = useState<PageInfo>(initialPageInfo);
  const pageInfoRef = useRef(pageInfo);
  pageInfoRef.current = pageInfo;

  const toast = useToast();

  const fetchMore = useCallback(async () => {
    if (!pageInfoRef.current?.hasNextPage) return;

    try {
      const { mahjongSessions: nextMahjongSessions, pageInfo: newPageInfo } =
        await fetchParticipatedMahjongSessions({ pageInfo: pageInfoRef.current });

      if (nextMahjongSessions) {
        setSessions(prev => [...prev, ...nextMahjongSessions]);
        setPageInfo(newPageInfo);
      }
    } catch (error) {
      captureException(error);

      toast({
        title: "麻雀セッションを取得できませんでした",
        description: "時間をおいて再度お試しください。",
        status: "error",
      });
    }
  }, [toast]);

  const { targetRef } = useInfiniteScroll({ callback: fetchMore });

  return (
    <>
      <UnorderedList styleType="none" m={0} p={0} spacing={4}>
        {sessions.map(session => (
          <MahjongSessionCard key={session.id} mahjongSession={session} />
        ))}
      </UnorderedList>

      <Box ref={targetRef} textAlign="center" mt={4}>
        {pageInfo?.hasNextPage ? "読み込み中..." : "全ての麻雀セッションを読み込みました ✅"}
      </Box>
    </>
  );
}
