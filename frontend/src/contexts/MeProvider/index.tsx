import { ReactNode } from "react";
import { fetchMeAction } from "@/src/actions/fetchMeAction";
import { MeProviderInner } from "./Inner";

export async function MeProvider({ children }: { children: ReactNode }) {
  const { data: me } = await fetchMeAction();

  return <MeProviderInner me={me ?? null}>{children}</MeProviderInner>;
}
