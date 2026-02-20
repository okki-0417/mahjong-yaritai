"use client";

import { Box, Skeleton, useDisclosure, useToast } from "@chakra-ui/react";
import PopButton from "@/src/components/PopButton";
import TileImage from "@/src/components/TileImage";
import NotLoggedInModal from "@/src/components/Modals/NotLoggedInModal";
import { useMutation } from "@apollo/client/react";
import {
  CreateWhatToDiscardProblemVoteDocument,
  DeleteWhatToDiscardProblemVoteDocument,
  DeleteWhatToDiscardProblemVoteInput,
  DeleteWhatToDiscardProblemVoteMutationVariables,
} from "@/src/generated/graphql";
import { SubmitHandler, useForm } from "react-hook-form";
import useGetSession from "@/src/hooks/useGetSession";

type Props = {
  problemId: string;
  doraId: string;
  tileId: string;
  isVoted: boolean;
  onCreate: () => void;
  onDelete: () => void;
};

export default function VoteButton({
  problemId,
  doraId,
  tileId,
  isVoted,
  onCreate,
  onDelete,
}: Props) {
  const { session } = useGetSession();
  const isLoggedIn = session?.isLoggedIn;

  const toast = useToast();

  const [createVote] = useMutation(CreateWhatToDiscardProblemVoteDocument, {
    onCompleted: data => {
      toast({
        title: data.createWhatToDiscardProblemVote.vote.tile.name + "に投票しました",
        status: "success",
      });

      onCreate();
    },
    onError: error => {
      toast({
        title: "投票に失敗しました",
        description: error.message,
        status: "error",
      });
    },
  });
  const [deleteVote] = useMutation<
    DeleteWhatToDiscardProblemVoteInput,
    DeleteWhatToDiscardProblemVoteMutationVariables
  >(DeleteWhatToDiscardProblemVoteDocument, {
    onCompleted: () => {
      toast({
        title: "投票を取り消しました",
        status: "success",
      });

      onDelete();
    },
    onError: error => {
      toast({
        title: "投票の取り消しに失敗しました",
        description: error.message,
        status: "error",
      });
    },
  });

  const {
    isOpen: isNotLoggedInModalOpen,
    onOpen: onNotLoggedInModalOpen,
    onClose: onNotLoggedInModalClose,
  } = useDisclosure();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit: SubmitHandler<{}> = async () => {
    if (!isLoggedIn) {
      onNotLoggedInModalOpen();
      return;
    }

    if (isVoted) {
      await deleteVote({
        variables: {
          whatToDiscardProblemId: problemId,
        },
      });
    } else {
      await createVote({
        variables: {
          problemId,
          tileId: String(tileId),
        },
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <PopButton type="submit" disabled={isSubmitting} className="aspect-tile relative">
          <TileImage tileId={tileId} isShiny={tileId == doraId} />

          <Box
            position="absolute"
            inset="0"
            zIndex="10"
            className={`${isVoted && "bg-blue-500/50"} rounded-sm`}
          />
          {isSubmitting && <VotingFallback />}
        </PopButton>
      </form>

      <NotLoggedInModal isOpen={isNotLoggedInModalOpen} onClose={onNotLoggedInModalClose} />
    </>
  );
}

const VotingFallback = () => {
  return (
    <Box position="absolute" inset="0" zIndex="5" rounded="sm">
      <Skeleton w="full" h="full" />
    </Box>
  );
};
