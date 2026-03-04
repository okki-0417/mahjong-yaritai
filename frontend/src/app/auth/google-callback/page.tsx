import GoogleVerification from "@/src/app/auth/google-callback/_components/GoogleVerification";
import ErrorPage from "@/src/components/errors/ErrorPage";

type Props = {
  searchParams: Promise<{
    code?: string;
  }>;
};

export default async function GoogleCallbackPage({ searchParams }: Props) {
  const { code } = await searchParams;

  try {
    if (!code) throw new Error("Googleからの認証コードが見つかりません。");

    return (
      <div className="mt-8 lg:w-4xl mx-auto">
        <GoogleVerification code={code} />
      </div>
    );
  } catch (error) {
    console.error("Google callback page error:", error);

    return (
      <ErrorPage
        message={error instanceof Error ? error.message : "認証に失敗しました"}
      />
    );
  }
}
