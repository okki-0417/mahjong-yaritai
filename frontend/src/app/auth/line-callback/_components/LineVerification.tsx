"use client";

import { useEffect, useState, useTransition } from "react";
import ErrorPage from "@/src/components/errors/ErrorPage";
import { Container } from "@chakra-ui/react";
import postLineCallbackAction from "@/src/actions/postLineCallbackActions";

type Props = {
  code: string;
  state: string;
};

export default async function LineVerification({ code, state }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const postLineCallback = async () => {
      startTransition(async () => {
        const errorMessage = await postLineCallbackAction(code, state);

        if (errorMessage) {
          setError(errorMessage);
        }
      });
    };

    postLineCallback();
  }, [code, state]);

  if (error) {
    return <ErrorPage message={error} />;
  }

  return (
    <Container maxW="container.md" mt="20">
      {isPending && <p>LINE認証を確認しています...</p>}
      {error && <ErrorPage message={error} />}
    </Container>
  );
}
