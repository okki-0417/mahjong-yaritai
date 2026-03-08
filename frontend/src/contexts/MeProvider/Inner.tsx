"use client";

import { createContext, ReactNode, useMemo } from "react";
import { User } from "@/src/types/components";

type MeContextType = {
  me: User | null;
  isLoggedIn: boolean;
};

export const MeContext = createContext<MeContextType | null>(null);

type Props = {
  children: ReactNode;
  me: User | null;
};

export function MeProviderInner({ children, me }: Props) {
  const value = useMemo(() => ({ me, isLoggedIn: !!me }), [me]);

  return <MeContext value={value}>{children}</MeContext>;
}
