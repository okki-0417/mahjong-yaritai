"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/src/lib/api/client";
import useGetSession from "@/src/hooks/useGetSession";
import ErrorPage from "@/src/components/errors/ErrorPage";
import Fallback from "@/src/components/fallbacks/Fallback";
import { captureException } from "@sentry/nextjs";
import { Container } from "@chakra-ui/react";

type Props = {
  code: string;
  state: string;
};

export default function LineVerification({ code, state }: Props) {
  const router = useRouter();
  const { updateSession } = useGetSession();
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isVerified) return;

    const handleCallback = async () => {
      try {
        const response = await apiClient.createLineCallback({ code, state });

        if (!response.session) {
          router.push("/users/new");
        } else if (response.session.is_logged_in) {
          await updateSession();
          router.push("/me");
        } else {
          throw new Error("正常に認証できませんでした。");
        }
      } catch (error) {
        captureException(error);
        setErrorMessage(error.message || "認証に失敗しました");
      }
    };

    handleCallback();
    setIsVerified(true);
  }, [code, state, router, isVerified, updateSession]);

  if (errorMessage) {
    return <ErrorPage message={errorMessage} />;
  }

  return (
    <Container maxW="container.md" mt="20">
      <Fallback />
    </Container>
  );
}
