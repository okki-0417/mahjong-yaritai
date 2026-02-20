import { SessionContext } from "@/src/contexts/SessionProvider";
import { useContext } from "react";

export default function useGetSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useGetSession must be used within a SessionProvider");
  }

  return context;
}
