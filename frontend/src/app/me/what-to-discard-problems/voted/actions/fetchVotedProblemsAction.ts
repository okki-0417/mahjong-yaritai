"use server";

import { PageInfo, VotedWhatToDiscardProblemsDocument } from "@/src/generated/graphql";
import { getClient } from "@/src/lib/apollo/server";

type Props = {
  pageInfo: PageInfo | null;
};

export default async function fetchVotedProblemsAction({ pageInfo }: Props) {
  if (pageInfo && !pageInfo.hasNextPage) {
    return { problems: [], pageInfo: null, error: null };
  }

  const client = getClient();

  const { data, error } = await client.query({
    query: VotedWhatToDiscardProblemsDocument,
    variables: {
      after: pageInfo ? pageInfo.endCursor : null,
      first: 3,
    },
  });

  if (error) {
    return { problems: [], pageInfo: null, error };
  }

  const problems = data.votedWhatToDiscardProblems.edges.map(edge => edge.node);
  const newPageInfo = data.votedWhatToDiscardProblems.pageInfo;

  return { problems, pageInfo: newPageInfo, error: null };
}
