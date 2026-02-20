"use client";

import { Button, Circle, HStack, Text } from "@chakra-ui/react";
import Image from "next/image";

type Props = {
  handler: () => any;
  label: string;
  iconSrc: string;
};

export default function SocialLoginButton({ handler, label, iconSrc }: Props) {
  return (
    <Button onClick={handler} rounded="full" w="72" bgColor="white" fontWeight="normal" py="2">
      <HStack w="full">
        <Circle size="8">
          <Image src={iconSrc} alt="" width="160" height="160" />
        </Circle>
        <Text w="full" className="text-primary">
          {label}
        </Text>
      </HStack>
    </Button>
  );
}
