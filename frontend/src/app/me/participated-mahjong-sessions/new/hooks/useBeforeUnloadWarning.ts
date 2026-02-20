"use client";

import { useEffect } from "react";

type Props = {
  isDirty: boolean;
};

export default function useBeforeUnloadWarning({ isDirty }: Props) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;

      e.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);
}
