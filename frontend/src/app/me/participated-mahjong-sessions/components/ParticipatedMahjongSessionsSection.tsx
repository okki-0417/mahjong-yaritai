import MahjongSessionsList from "@/src/app/me/participated-mahjong-sessions/components/MahjongSessionsList";
import ErrorPage from "@/src/components/errors/ErrorPage";
import {
  CurrentSessionDocument,
  ParticipatedMahjongSessionsDocument,
} from "@/src/generated/graphql";
import { getClient } from "@/src/lib/apollo/server";
import { captureException } from "@sentry/nextjs";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export default async function ParticipatedMahjongSessionsSection() {
  try {
    const client = getClient();
    const { data: sessionData } = await client.query({
      query: CurrentSessionDocument,
      fetchPolicy: "network-only",
    });

    if (sessionData.currentSession.isLoggedIn == false) {
      redirect("/auth/request");
    }

    const { data, error } = await client.query({
      query: ParticipatedMahjongSessionsDocument,
      variables: { after: null, first: 10 },
      fetchPolicy: "network-only",
    });

    if (error) {
      throw new Error(error.message || "参加した麻雀セッションの取得に失敗しました");
    }

    const mahjongSessions = data.participatedMahjongSessions.edges.map(edge => edge.node);
    const pageInfo = data.participatedMahjongSessions.pageInfo;

    return <MahjongSessionsList initialSessions={mahjongSessions} initialPageInfo={pageInfo} />;
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    /* eslint-disable-next-line no-console */
    console.error("Error fetching participated mahjong sessions:", error);
    captureException(error);

    return <ErrorPage message={error.message} />;
  }
}
