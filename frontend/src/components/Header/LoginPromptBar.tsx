"use client";

import {
  Box,
  HStack,
  Text,
  CloseButton,
  Button,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import useMe from "@/src/hooks/useMe";

const STORAGE_KEY = "loginPromptDismissed";

export default function LoginPromptBar() {
  const pathname = usePathname();
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    // クライアントサイドでのみsessionStorageを確認
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    setIsDismissed(dismissed === "true");
  }, []);

  const { isLoggedIn } = useMe();
  const isAuthPage = pathname?.startsWith("/auth");
  const isUserNewPage = pathname === "/users/new";

  if (isLoggedIn !== false || isDismissed || isAuthPage || isUserNewPage) {
    return null;
  }

  const handleDismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setIsDismissed(true);
  };

  return (
    <Box
      w="full"
      py="1"
      px="1"
      bg="neutral.100"
      color="primary.500"
      position="relative"
      boxShadow="sm"
    >
      <HStack justifyContent="center" position="relative">
        <Button as={Link} href="/auth/request" colorScheme="pink" size="sm">
          ログイン / 新規登録
        </Button>
        <Text fontSize="sm">でさらに便利に使えます</Text>
      </HStack>
      <VStack position="absolute" right="0" insetY="0" justifyContent="center">
        <CloseButton
          size="sm"
          color="primary.500"
          onClick={handleDismiss}
          aria-label="閉じる"
        />
      </VStack>
    </Box>
  );
}
