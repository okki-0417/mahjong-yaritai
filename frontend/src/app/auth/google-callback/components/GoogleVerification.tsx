"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as Sentry from "@sentry/nextjs";
import { apiClient } from "@/src/lib/api/client";
import ErrorPage from "@/src/components/errors/ErrorPage";
import Fallback from "@/src/components/fallbacks/Fallback";
import useGetSession from "@/src/hooks/useGetSession";
import { Container } from "@chakra-ui/react";

type Props = { code: string };

// サーバーコンポーネントのAPI通信ではレスポンスのSetCookieがブラウザに反映されないため、
// クライアントコンポーネントにする必要がある。
export default function GoogleVerification({ code }: Props) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();
  const { updateSession } = useGetSession();

  useEffect(() => {
    if (isVerified) return;

    const verifyGoogleCallback = async () => {
      try {
        const response = await apiClient.createGoogleCallback({ code });

        if (!response.session) {
          router.push("/users/new");
        } else if (response.session.is_logged_in) {
          await updateSession();
          router.push("/me");
        } else {
          throw new Error("正常に認証できませんでした。");
        }
      } catch (error) {
        Sentry.captureException(error);
        setErrorMessage(error.message || "認証に失敗しました");
      }
    };

    verifyGoogleCallback();
    setIsVerified(true);
  }, [code, router, isVerified, updateSession]);

  if (errorMessage) {
    return <ErrorPage message={errorMessage} />;
  }

  return (
    <Container maxW="container.md" mt="20">
      <Fallback />
    </Container>
  );
}
