"use client";

import {
  WhatToDiscardProblem,
  WhatToDiscardProblemVoteResult,
  WhatToDiscardProblemVoteResultDocument,
} from "@/src/generated/graphql";
import { Box, HStack, Text, useDisclosure, useToast, VStack, Wrap } from "@chakra-ui/react";
import { Fragment, useState } from "react";
import VoteButton from "@/src/app/what-to-discard-problems/components/votes/VoteButton";
import TileImage from "@/src/components/TileImage";
import ProblemDescriptionModal from "@/src/app/what-to-discard-problems/components/ProblemSection/ProblemCard/ProblemDescriptionModal";
import ProblemLikeSection from "@/src/app/what-to-discard-problems/components/ProblemSection/ProblemCard/ProblemLikeSection";
import ProblemCardHeader from "@/src/app/what-to-discard-problems/components/ProblemSection/ProblemCard/ProblemCardHeader";
import TilesDisplay from "@/src/app/what-to-discard-problems/components/ProblemSection/ProblemCard/TilesDisplay";
import ProblemCommentSection from "@/src/app/what-to-discard-problems/components/ProblemSection/ProblemCard/ProblemCommentSection";
import ProblemVoteSection from "@/src/app/what-to-discard-problems/components/votes/ProblemVoteSection";
import VoteResultModal from "@/src/components/Modals/VoteResultModal";
import { useLazyQuery } from "@apollo/client/react";
import { clearQueryCache } from "@/src/lib/apollo/cache";

type Props = {
  problem: WhatToDiscardProblem;
};

export default function ProblemCard({ problem }: Props) {
  const [votesCount, setVotesCount] = useState(problem.votesCount);
  const [voteResults, setVoteResults] = useState<WhatToDiscardProblemVoteResult[]>([]);
  const [myVoteTileId, setMyVoteTileId] = useState<string | null>(problem.myVoteTileId);

  const toast = useToast();

  const [fetchVoteResults, { loading: isLoadingVoteResults }] = useLazyQuery(
    WhatToDiscardProblemVoteResultDocument,
  );

  const {
    isOpen: isDescriptionOpen,
    onOpen: onDescriptionOpen,
    onClose: onDescriptionClose,
  } = useDisclosure();

  const {
    isOpen: isVoteResultOpen,
    onOpen: onVoteResultOpen,
    onClose: onVoteResultClose,
  } = useDisclosure();

  const handleVoteResultOpen = async () => {
    if (isLoadingVoteResults) return;

    const result = await fetchVoteResults({
      variables: { whatToDiscardProblemId: problem.id },
    });

    if (result.error) {
      toast({
        status: "error",
        title: "投票結果を取得できませんでした",
        description: result.error.message,
      });
      return;
    }

    if (result.data) {
      setVoteResults(result.data.whatToDiscardProblemVoteResults);
      onVoteResultOpen();
    }
  };

  const onVoteCreate = async (tileId: string) => {
    const prevMyVoteTileId = myVoteTileId;
    setMyVoteTileId(tileId);

    if (prevMyVoteTileId == null) setVotesCount(votesCount + 1);

    clearQueryCache("whatToDiscardProblemVoteResults");

    if (isVoteResultOpen) {
      const result = await fetchVoteResults({
        variables: { whatToDiscardProblemId: problem.id },
      });
      setVoteResults(result.data.whatToDiscardProblemVoteResults);
    }
  };

  const onVoteDelete = () => {
    setMyVoteTileId(null);
    setVotesCount(votesCount - 1);

    clearQueryCache("whatToDiscardProblemVoteResults");
  };

  return (
    <Box className="md:max-w-2xl w-screen px-1">
      <Text fontSize="sm">{new Date(problem.createdAt).toLocaleString()}</Text>

      <VStack borderRadius="md" shadow="md" alignItems="stretch" gap="0" overflow="hidden">
        <Box pt="2" px={["2", "4"]} pb="3" className="bg-mj-mat">
          <ProblemCardHeader problem={problem} />

          <HStack gap="2" mt={["2", "0"]} align="flex-end">
            <TilesDisplay
              tileIds={[
                problem.hand1Id,
                problem.hand2Id,
                problem.hand3Id,
                problem.hand4Id,
                problem.hand5Id,
                problem.hand6Id,
                problem.hand7Id,
                problem.hand8Id,
                problem.hand9Id,
                problem.hand10Id,
                problem.hand11Id,
                problem.hand12Id,
                problem.hand13Id,
              ]}
              doraId={problem.doraId}
              problemId={problem.id}
              myVoteTileId={myVoteTileId}
              onVoteCreate={onVoteCreate}
              onVoteDelete={onVoteDelete}
            />

            <Box display={["none", "block"]}>
              <VStack gap="0" align="center">
                <Text fontSize={["sm", "md"]}>ツモ</Text>
                <VoteButton
                  problemId={problem.id}
                  doraId={problem.doraId}
                  tileId={problem.tsumoId}
                  isVoted={Boolean(myVoteTileId == problem.tsumoId)}
                  onCreate={() => onVoteCreate(problem.tsumoId)}
                  onDelete={onVoteDelete}
                />
              </VStack>
            </Box>
          </HStack>

          <Wrap mt="2" spacingY="0" align="center">
            <HStack gap="1">
              <Text fontSize={["sm", "md"]}>ドラ</Text>
              <Box h="8" aspectRatio="7/9">
                <TileImage tileId={Number(problem.doraId)} hover={false} />
              </Box>
            </HStack>

            <Box display={["block", "none"]}>
              <HStack gap="1" align="center">
                <Text fontSize={["sm", "md"]}>ツモ</Text>
                <Box h="8" aspectRatio="7/9">
                  <VoteButton
                    problemId={problem.id}
                    doraId={problem.doraId}
                    tileId={problem.tsumoId}
                    isVoted={Boolean(myVoteTileId == problem.tsumoId)}
                    onCreate={() => onVoteCreate(problem.tsumoId)}
                    onDelete={onVoteDelete}
                  />
                </Box>
              </HStack>
            </Box>

            {problem.round && <Text fontSize={["sm", "md"]}>{problem.round}局</Text>}
            {problem.turn && <Text fontSize={["sm", "md"]}>{problem.turn}巡目</Text>}
            {problem.wind && <Text fontSize={["sm", "md"]}>{problem.wind}家</Text>}
            {problem.points && <Text fontSize={["sm", "md"]}>{problem.points}点持ち</Text>}
          </Wrap>

          {problem.description && (
            <Fragment>
              <Box
                mt="4"
                className="line-clamp-2"
                cursor="pointer"
                position="relative"
                onClick={onDescriptionOpen}>
                <Text fontSize={["xs", "sm"]}>{problem.description}</Text>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-mj-mat z-10" />
              </Box>

              <ProblemDescriptionModal
                description={problem.description}
                isOpen={isDescriptionOpen}
                onClose={onDescriptionClose}
              />
            </Fragment>
          )}
        </Box>

        <HStack
          px={["2", "4"]}
          py={["1", "2"]}
          color="gray.700"
          className="rounded-b-md bg-neutral">
          <ProblemLikeSection
            initialIsLiked={problem.isLikedByMe}
            initialLikesCount={problem.likesCount}
            problemId={problem.id}
          />

          <ProblemCommentSection
            initialCommentsCount={problem.commentsCount}
            problemId={problem.id}
          />

          <ProblemVoteSection
            isVoted={Boolean(myVoteTileId)}
            votesCount={votesCount}
            onOpenVoteResult={handleVoteResultOpen}
            isLoadingVoteResults={isLoadingVoteResults}
          />

          <VoteResultModal
            doraId={problem.doraId}
            problemId={problem.id}
            voteResults={voteResults}
            isOpen={isVoteResultOpen}
            onClose={onVoteResultClose}
            onVoteCreate={onVoteCreate}
            onVoteDelete={onVoteDelete}
            myVoteTileId={myVoteTileId}
          />
        </HStack>
      </VStack>
    </Box>
  );
}
