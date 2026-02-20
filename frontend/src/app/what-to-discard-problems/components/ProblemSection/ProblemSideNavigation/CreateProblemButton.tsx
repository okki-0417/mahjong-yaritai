"use client";

import ProblemCreateFormModal from "@/src/app/what-to-discard-problems/components/ProblemSection/ProblemSideNavigation/ProblemCreateFormModal";
import useProblems from "@/src/app/what-to-discard-problems/hooks/useProblems";
import { WhatToDiscardProblem } from "@/src/generated/graphql";
import { Button, HStack, Text, useDisclosure } from "@chakra-ui/react";
import { IoCreate } from "react-icons/io5";

export default function CreateProblemButton() {
  const {
    isOpen: isProblemFormOpen,
    onOpen: onProblemFormOpen,
    onClose: onProblemFormClose,
  } = useDisclosure();

  const { setProblems } = useProblems();

  const onProblemCreated = (newProblem: WhatToDiscardProblem) => {
    setProblems(prevProblems => [newProblem, ...prevProblems]);
    onProblemFormClose();
  };

  return (
    <>
      <Button variant="ghost" w="full" justifyContent="start" onClick={onProblemFormOpen}>
        <HStack className="text-primary">
          <IoCreate size={20} />
          <Text>問題を作成する</Text>
        </HStack>
      </Button>

      <ProblemCreateFormModal
        isOpen={isProblemFormOpen}
        onClose={onProblemFormClose}
        onProblemCreated={onProblemCreated}
      />
    </>
  );
}
