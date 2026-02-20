import { RefObject, useCallback, useEffect, useMemo, useRef, useTransition } from "react";

type ReturnType = {
  targetRef: RefObject<HTMLDivElement>;
  isPending: boolean;
};

type Props = {
  callback: () => Promise<void>;
};

export default function useInfiniteScroll({ callback }: Props): ReturnType {
  const targetRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();

  const handleEntry = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (!entry.isIntersecting) return;
      if (isPending) return;

      startTransition(() => callback());
    },
    [callback, isPending],
  );

  const observer = useMemo(() => new IntersectionObserver(handleEntry), [handleEntry]);

  useEffect(() => {
    if (!targetRef.current) return null;

    observer.observe(targetRef.current);
    return () => observer.disconnect();
  }, [observer]);

  return { targetRef, isPending };
}
