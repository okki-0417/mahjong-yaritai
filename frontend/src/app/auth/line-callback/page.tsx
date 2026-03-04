import LineVerification from "@/src/app/auth/line-callback/_components/LineVerification";
import ErrorPage from "@/src/components/errors/ErrorPage";

type Props = {
  searchParams: Promise<{
    code?: string;
    state?: string;
  }>;
};

export default async function LineCallbackPage({ searchParams }: Props) {
  try {
    const { code, state } = await searchParams;

    if (!code) throw new Error("LINEからの認証コードが見つかりません。");
    if (!state) throw new Error("不正なリクエストです。");

    return (
      <div className="mt-8 lg:w-4xl mx-auto">
        <LineVerification code={code} state={state} />
      </div>
    );
  } catch (error) {
    console.error("LINE callback page error:", error);

    return (
      <ErrorPage
        message={error instanceof Error ? error.message : "認証に失敗しました"}
      />
    );
  }
}
