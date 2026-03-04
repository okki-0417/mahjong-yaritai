"use client";

import postGoogleCallbackAction from "@/src/actions/postGoogleCallbackAction";
import ErrorPage from "@/src/components/errors/ErrorPage";
import { useEffect, useState, useTransition } from "react";

type Props = { code: string };

export default function GoogleVerification({ code }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const postGoogleCallback = async () => {
      startTransition(async () => {
        const errorMessage = await postGoogleCallbackAction(code);

        if (errorMessage) {
          setError(errorMessage);
        }
      });
    };

    postGoogleCallback();
  }, [code]);

  return (
    <div>
      {isPending && <p>Google認証を確認しています...</p>}
      {error && <ErrorPage message={error} />}
    </div>
  );
}
