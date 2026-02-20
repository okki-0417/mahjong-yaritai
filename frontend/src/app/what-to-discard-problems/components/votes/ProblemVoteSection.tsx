"use client";

import { Tile } from "@/src/generated/graphql";
import PopButton from "@/src/components/PopButton";
import { HStack, Text } from "@chakra-ui/react";
import Image from "next/image";
import VoteIconDefault from "@/public/vote-icon-default.webp";
import VoteIconBlue from "@/public/vote-icon-blue.webp";

export type MyVoteType = Tile | null;

type Props = {
  isVoted: boolean;
  votesCount: number;
  isLoadingVoteResults?: boolean;
  onOpenVoteResult?: () => void;
};

export default function ProblemVoteSection({
  isVoted,
  votesCount,
  isLoadingVoteResults,
  onOpenVoteResult = () => null,
}: Props) {
  return (
    <PopButton onClick={onOpenVoteResult} isLoading={isLoadingVoteResults}>
      <HStack gap="2px">
        {isVoted ? (
          <Image src={VoteIconBlue} alt="投票結果を見る" width={30} height={30} />
        ) : (
          <Image src={VoteIconDefault} alt="投票結果を見る" width={30} height={30} />
        )}
        <Text fontFamily="sans-serif" fontWeight="bold">
          {votesCount}
        </Text>
      </HStack>
    </PopButton>
  );
}
