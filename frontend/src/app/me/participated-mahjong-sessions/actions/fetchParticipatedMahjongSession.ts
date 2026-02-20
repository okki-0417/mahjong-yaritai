import {
  ParticipatedMahjongSessionDocument,
  ParticipatedMahjongSessionQuery,
} from "@/src/generated/graphql";
import { getClient } from "@/src/lib/apollo/server";

type Props = {
  id: string;
};

type ReturnType = {
  mahjongSession: ParticipatedMahjongSessionQuery["participatedMahjongSession"] | null;
};

export default async function fetchParticipatedMahjongSession({ id }: Props): Promise<ReturnType> {
  const client = getClient();

  const { data, error } = await client.query({
    query: ParticipatedMahjongSessionDocument,
    variables: { id },
    fetchPolicy: "network-only",
  });

  if (error) {
    throw new Error(error.message);
  }

  const mahjongSession = data.participatedMahjongSession;

  return { mahjongSession };
}
