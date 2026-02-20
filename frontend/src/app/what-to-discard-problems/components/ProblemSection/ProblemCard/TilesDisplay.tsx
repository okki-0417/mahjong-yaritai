"use client";

import VoteButton from "@/src/app/what-to-discard-problems/components/votes/VoteButton";
import { HStack } from "@chakra-ui/react";

type Props = {
  tileIds: string[];
  doraId: string;
  problemId: string;
  myVoteTileId: string | null;
  /* eslint-disable-next-line no-unused-vars */
  onVoteCreate: (tileId: string) => void;
  onVoteDelete: () => void;
};

export default function TilesDisplay({
  tileIds,
  problemId,
  doraId,
  myVoteTileId,
  onVoteCreate,
  onVoteDelete,
}: Props) {
  return (
    <HStack gap="1px">
      {[...tileIds].map((tileId, index) => {
        return (
          <VoteButton
            key={index}
            problemId={problemId}
            doraId={doraId}
            tileId={tileId}
            isVoted={tileId === myVoteTileId}
            onCreate={() => onVoteCreate(tileId)}
            onDelete={onVoteDelete}
          />
        );
      })}
    </HStack>
  );
}
