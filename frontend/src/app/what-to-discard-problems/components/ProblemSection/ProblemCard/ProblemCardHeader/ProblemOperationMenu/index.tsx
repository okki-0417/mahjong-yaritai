"use client";

import ProblemDeleteItem from "@/src/app/what-to-discard-problems/components/ProblemSection/ProblemCard/ProblemCardHeader/ProblemOperationMenu/ProblemDeleteItem";
import ProblemEditItem from "@/src/app/what-to-discard-problems/components/ProblemSection/ProblemCard/ProblemCardHeader/ProblemOperationMenu/ProblemEditItem";
import { WhatToDiscardProblem } from "@/src/generated/graphql";
import { Menu, MenuButton, MenuList } from "@chakra-ui/react";
import { Fragment } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

type Props = {
  problem: WhatToDiscardProblem;
  isMyProblem: boolean;
};

export default function ProblemOperationMenu({ problem, isMyProblem }: Props) {
  return (
    <Menu>
      <MenuButton>
        <HiOutlineDotsHorizontal size={22} />
      </MenuButton>

      <MenuList>
        {isMyProblem && (
          <Fragment>
            <ProblemEditItem problem={problem} />
            <ProblemDeleteItem problem={problem} />
          </Fragment>
        )}

        {/* <MenuItem icon={<FiAlertTriangle size={18} color="red" />}>
          <span className="text-red-500">通報する</span>
        </MenuItem> */}
      </MenuList>
    </Menu>
  );
}
