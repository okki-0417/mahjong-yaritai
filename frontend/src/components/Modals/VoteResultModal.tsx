"use client";

import VoteButton from "@/src/app/what-to-discard-problems/components/votes/VoteButton";
import { WhatToDiscardProblemVoteResult } from "@/src/generated/graphql";
import {
  Box,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";

type Props = {
  problemId: string;
  voteResults: WhatToDiscardProblemVoteResult[];
  isOpen: boolean;
  onClose: () => void;
  myVoteTileId: string | null;
  doraId: string;
  /* eslint-disable-next-line no-unused-vars */
  onVoteCreate: (tileId: string) => void;
  onVoteDelete: () => void;
};

export default function VoteResultModal({
  doraId,
  problemId,
  voteResults = [],
  isOpen,
  onClose,
  onVoteCreate,
  onVoteDelete,
  myVoteTileId,
}: Props) {
  const sortedVoteResults = [...voteResults].sort((a, b) => Number(a.tileId) - Number(b.tileId));
  const mostVotedCount = Math.max(...voteResults.map(r => r.count), 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
      <ModalOverlay />

      <ModalContent background="gray.50" fontFamily="serif">
        <ModalHeader fontFamily="serif">投票結果</ModalHeader>

        <ModalCloseButton />

        <ModalBody className="bg-mj-mat">
          <HStack spacing="1px" mt="3" justify="center" align="flex-end">
            {sortedVoteResults.map(result => {
              const tileId = result.tileId;
              const voteCount = result.count;

              return (
                <VStack key={tileId} spacing="1" align="center" h="250px">
                  <VStack spacing="1" h="200px" justify="flex-end">
                    <Text fontSize="sm" className="text-neutral">
                      {voteCount}票
                    </Text>
                    <Box
                      h={`${Math.round((voteCount / mostVotedCount) * 100)}%`}
                      w="5"
                      className={`${myVoteTileId == tileId ? "bg-blue-400" : "bg-green-400"}
                        border border-neutral border-b-0 rounded-t-sm`}
                    />
                  </VStack>

                  <VoteButton
                    problemId={problemId}
                    doraId={doraId}
                    tileId={result.tileId}
                    isVoted={Boolean(myVoteTileId == result.tileId)}
                    onCreate={() => onVoteCreate(result.tileId)}
                    onDelete={onVoteDelete}
                  />
                </VStack>
              );
            })}
          </HStack>
        </ModalBody>

        <ModalFooter>
          <Text fontSize="sm">総投票数: {voteResults.reduce((sum, r) => sum + r.count, 0)}票</Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
