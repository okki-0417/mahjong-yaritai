"use client";

import TileImage from "@/src/components/TileImage";
import ProblemLike from "@/src/app/what-to-discard-problems/_components/ProblemSection/ProblemCard/ProblemLike";
import ProblemCardHeader from "@/src/app/what-to-discard-problems/_components/ProblemSection/ProblemCard/ProblemCardHeader";
import ProblemCommentSection from "@/src/app/what-to-discard-problems/_components/ProblemSection/ProblemCard/ProblemCommentSection";
import { WhatToDiscardProblem } from "@/src/types/components";
import ProblemDescription from "@/src/app/what-to-discard-problems/_components/ProblemSection/ProblemCard/ProblemDescription";
import { useState } from "react";
import VoteButton from "@/src/app/what-to-discard-problems/_components/votes/VoteButton";

type Props = {
  problem: WhatToDiscardProblem;
  onUpdate: (updatedProblem: WhatToDiscardProblem) => void;
};

export default function ProblemCard({ problem, onUpdate }: Props) {
  const [myVoteTileId, setMyVoteTileId] = useState<number | null>(
    problem.my_vote_tile_id,
  );
  const [votesCount, setVotesCount] = useState<number>(problem.votes_count);

  const onVote = (tileId: number) => {
    setMyVoteTileId(tileId);
    setVotesCount((prev) => prev + 1);
  };

  const onUnvote = () => {
    setMyVoteTileId(null);
    setVotesCount((prev) => prev - 1);
  };

  return (
    <div className="md:max-w-2xl w-screen px-1">
      <p className="text-sm">{new Date(problem.created_at).toLocaleString()}</p>

      <div className="rounded-sm shadow flex flex-col items-stretch overflow-hidden">
        <div className="bg-mj-mat pt-2 lg:px-4 px-2 pb-3">
          <ProblemCardHeader problem={problem} onUpdate={onUpdate} />

          <div className="flex gap-2 mt-2 lg:-mt-3 items-end">
            <div className="flex gap-px items-end">
              {[
                problem.hand1_id,
                problem.hand2_id,
                problem.hand3_id,
                problem.hand4_id,
                problem.hand5_id,
                problem.hand6_id,
                problem.hand7_id,
                problem.hand8_id,
                problem.hand9_id,
                problem.hand10_id,
                problem.hand11_id,
                problem.hand12_id,
                problem.hand13_id,
              ].map((tileId, index) => (
                <VoteButton
                  key={index}
                  problemId={problem.id}
                  isDora={tileId === problem.dora_id}
                  tileId={tileId}
                  myVoteTileId={myVoteTileId}
                  onCreate={onVote}
                  onDelete={onUnvote}
                />
              ))}
            </div>

            <div className="lg:block hidden">
              <div className="flex flex-col items-center">
                <p className="text-sm lg:text-base">ツモ</p>
                <VoteButton
                  problemId={problem.id}
                  isDora={problem.tsumo_id === problem.dora_id}
                  tileId={problem.tsumo_id}
                  myVoteTileId={myVoteTileId}
                  onCreate={onVote}
                  onDelete={onUnvote}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap mt-2 gap-x-2 items-center">
            <div className="flex gap-1 items-center">
              <p className="text-sm lg:text-base">ドラ</p>
              <div className="w-8">
                <TileImage
                  tileId={Number(problem.dora_id)}
                  className="h-full object-contain"
                />
              </div>
            </div>

            <div className="block lg:hidden">
              <div className="flex gap-1 items-center">
                <p className="text-sm lg:text-base">ツモ</p>
                <div className="h-8 aspect-ratio-7/9">
                  <VoteButton
                    problemId={problem.id}
                    isDora={problem.tsumo_id === problem.dora_id}
                    tileId={problem.tsumo_id}
                    myVoteTileId={myVoteTileId}
                    onCreate={onVote}
                    onDelete={onUnvote}
                  />
                </div>
              </div>
            </div>

            {problem.round && (
              <p className="text-sm lg:text-base">{problem.round}局</p>
            )}
            {problem.turn && (
              <p className="text-sm lg:text-base">{problem.turn}巡目</p>
            )}
            {problem.wind && (
              <p className="text-sm lg:text-base">{problem.wind}家</p>
            )}
            {problem.points && (
              <p className="text-sm lg:text-base">{problem.points}点持ち</p>
            )}
          </div>

          {problem.description && (
            <div>
              <ProblemDescription description={problem.description} />
            </div>
          )}
        </div>

        <div className="flex gap-2 lg:px-4 px-2 lg:py-2 py-1 items-center text-primary bg-neutral">
          <ProblemLike
            initialMyLikeId={problem.my_like_id}
            initialLikesCount={problem.likes_count}
            problemId={problem.id}
          />

          <ProblemCommentSection
            initialCommentsCount={problem.comments_count}
            problemId={problem.id}
          />

          {/* <ProblemVoteSection
            isVoted={Boolean(myVoteTileId)}
            votesCount={votesCount}
            onOpenVoteResult={handleVoteResultOpen}
            isLoadingVoteResults={isLoadingVoteResults}
          /> */}

          {/* <VoteResultModal
            doraId={problem.dora_id}
            problemId={problem.id}
            voteResults={voteResults}
            isOpen={isVoteResultOpen}
            onClose={onVoteResultClose}
            onVoteCreate={onVoteCreate}
            onVoteDelete={onVoteDelete}
            myVoteTileId={myVoteTileId}
          /> */}
        </div>
      </div>
    </div>
  );
}
