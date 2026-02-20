"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { CurrentSessionDocument, CurrentSessionQuery, Session } from "@/src/generated/graphql";

type SessionContextType = {
  session: CurrentSessionQuery["currentSession"] | null;
  updateSession: () => Promise<void>;
};

export const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const { data, refetch } = useQuery(CurrentSessionDocument);
  const [isLoaded, setIsLoaded] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    if (isLoaded) return;
    if (!data?.currentSession) return;

    setSession(data.currentSession);
    setIsLoaded(true);
  }, [isLoaded, data]);

  const updateSession = async () => {
    const refetchData = await refetch();
    setSession(refetchData.data.currentSession);
  };

  return (
    <SessionContext.Provider value={{ session, updateSession }}>{children}</SessionContext.Provider>
  );
}
