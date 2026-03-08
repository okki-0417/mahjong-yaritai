"use client";

import PopButton from "@/src/components/PopButton";
import TileImage from "@/src/components/TileImage";
import NotLoggedInModal from "@/src/components/Modals/NotLoggedInModal";
import { SubmitHandler, useForm } from "react-hook-form";
import useToast from "@/src/hooks/useToast";
import { useDisclosure } from "@/src/hooks/useDisclosure";
import deleteVoteAction from "@/src/actions/deleteVoteAction";
import createVoteAction from "@/src/actions/createVoteAction";
import { Vote } from "@/src/types/components";
import useMe from "@/src/hooks/useMe";

type Props = {
  problemId: number;
  isDora: boolean;
  tileId: number;
  myVoteTileId: number | null;
  onCreate: (tileId: number) => void;
  onDelete: () => void;
};

export default function VoteButton({
  problemId,
  isDora,
  tileId,
  myVoteTileId,
  onCreate,
  onDelete,
}: Props) {
  const { isLoggedIn } = useMe();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isVoted = myVoteTileId === tileId;

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit: SubmitHandler<{}> = async () => {
    if (!isLoggedIn) {
      onOpen();
      return;
    }

    if (isVoted) {
      try {
        await deleteVoteAction({ problemId, voteId: myVoteTileId });
        onDelete();
      } catch (error) {
        toast({
          title: "投票の削除に失敗しました",
          status: "error",
          description:
            error instanceof Error
              ? error.message
              : "予期せぬエラーが発生しました",
        });
      }
    } else {
      try {
        const newVote = await createVoteAction({ problemId, tileId });
        onCreate(newVote.tile_id);
      } catch (error) {
        toast({
          title: "投票の作成に失敗しました",
          status: "error",
          description:
            error instanceof Error
              ? error.message
              : "予期せぬエラーが発生しました",
        });
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <PopButton
          type="submit"
          disabled={isSubmitting}
          className="aspect-tile relative"
        >
          <TileImage tileId={tileId} isShiny={isDora} />

          <div
            className={`${isVoted && "bg-blue-500/50"} rounded-sm absolute inset-0 z-10`}
          />
          {isSubmitting && <VotingFallback />}
        </PopButton>
      </form>

      {isOpen && <NotLoggedInModal isOpen={isOpen} onClose={onClose} />}
    </>
  );
}

const VotingFallback = () => {
  return (
    <div className="absolute inset-0 z-5 rounded-sm">
      <div className="bg-gray-200 inset-0" />
    </div>
  );
};
