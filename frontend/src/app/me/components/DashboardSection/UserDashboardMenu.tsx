"use client";

import { useLogout } from "@/src/hooks/useLogout";
import { Button, HStack, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { IoMdLogOut } from "react-icons/io";

export default function UserDashboardMenu() {
  const { isSubmitting, onSubmit } = useLogout();
  const handleLogoutClick = async () => {
    if (isSubmitting) return;
    await onSubmit();
  };

  return (
    <Menu>
      <MenuButton
        as={Button}
        variant="ghost"
        size="sm"
        colorScheme=""
        color="neutral.50"
        _hover={{ bg: "secondary.300" }}>
        <BsThreeDots size={20} color="white" />
      </MenuButton>

      <MenuList color="secondary.500">
        <MenuItem onClick={handleLogoutClick} isDisabled={isSubmitting}>
          <HStack>
            <IoMdLogOut size={16} color="red" />
            <Text color="red.500">ログアウト</Text>
          </HStack>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
