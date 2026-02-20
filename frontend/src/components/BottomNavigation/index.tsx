"use client";

import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { MdHome, MdPerson } from "react-icons/md";
import useGetSession from "@/src/hooks/useGetSession";

export default function BottomNavigation() {
  const { session } = useGetSession();
  const isLoggedIn = session?.isLoggedIn;

  return (
    <Box
      as="nav"
      position="fixed"
      bottom="0"
      insetX="0"
      zIndex="50"
      display={{ base: "block", md: "none" }}
      bg="primary.500"
      pb="env(safe-area-inset-bottom)">
      <HStack justify="space-around" pt="2" pb="1">
        {isLoggedIn && (
          <Link href="/me">
            <VStack spacing="0.5" color="white">
              <MdPerson size={24} />
              <Text fontSize="xs" fontFamily="PT serif, serif" fontWeight="bold">
                マイページ
              </Text>
            </VStack>
          </Link>
        )}
        <Link href="/what-to-discard-problems">
          <VStack spacing="0.5" color="white">
            <MdHome size={24} />
            <Text fontSize="xs" fontFamily="PT serif, serif" fontWeight="bold">
              何切る
            </Text>
          </VStack>
        </Link>
      </HStack>
    </Box>
  );
}
