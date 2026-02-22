import LineVerification from "@/src/app/auth/line-callback/components/LineVerification";
import ErrorPage from "@/src/components/errors/ErrorPage";

type Props = {
  searchParams: Promise<{
    code?: string;
    state?: string;
  }>;
};

export default async function LineCallbackPage({ searchParams }: Props) {
  const { code, state } = await searchParams;

  try {
    if (!code) throw new Error("LINEからの認証コードが見つかりません。");
    if (!state) throw new Error("不正なリクエストです。");

    return <LineVerification code={code} state={state} />;
  } catch (error) {
    /* eslint-disable-next-line no-console */
    console.error("LINE callback page error:", error);
    return <ErrorPage message={error.message || "認証に失敗しました"} />;
  }
}
