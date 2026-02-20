import { ProblemsContext } from "@/src/app/what-to-discard-problems/contexts/ProblemsContextProvider";
import { useContext } from "react";

export default function useProblems() {
  const { problems, setProblems, pageInfo, setPageInfo } = useContext(ProblemsContext)!;

  return { problems, setProblems, pageInfo, setPageInfo };
}
