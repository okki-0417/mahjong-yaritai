"use client";

import { apolloClient } from "@/src/lib/apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { ReactNode } from "react";

export default function AppolloProviderWrapper({ children }: { children: ReactNode }) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
