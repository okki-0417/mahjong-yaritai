import { MeContext } from "@/src/contexts/MeProvider/Inner";
import { User } from "@/src/types/components";
import { useContext } from "react";

export default function useMe(): {
  me: User | null;
  isLoggedIn: boolean;
} {
  const context = useContext(MeContext);

  if (!context) {
    throw new Error("useMe must be used within a MeProvider");
  }

  return { me: context.me, isLoggedIn: context.isLoggedIn };
}
