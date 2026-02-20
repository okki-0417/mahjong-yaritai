"use client";

import { Circle, HStack, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import LogoImg from "@/public/logo.webp";
import useGetSession from "@/src/hooks/useGetSession";

export default function LogoLink() {
  const { session } = useGetSession();
  const homePath = session?.isLoggedIn ? "/me" : "/top";

  return (
    <Link href={homePath}>
      <HStack>
        <Circle overflow="hidden" size={["8", "auto"]}>
          <Image
            src={LogoImg}
            alt="麻雀好きが集まる場所"
            width={40}
            height={40}
            className="aspect-square"
          />
        </Circle>
        <Text fontWeight="bold" fontSize={["xl", "2xl", "3xl"]}>
          麻雀ヤリタイ
        </Text>
      </HStack>
    </Link>
  );
}
