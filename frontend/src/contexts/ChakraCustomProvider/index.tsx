"use client";

import { customTheme } from "@/src/contexts/ChakraCustomProvider/theme";
import { ChakraProvider } from "@chakra-ui/react";

type Props = {
  children: React.ReactNode;
};

export default function ChakraCustomProvider({ children }: Props) {
  return (
    <ChakraProvider resetCSS={false} theme={customTheme}>
      {children}
    </ChakraProvider>
  );
}
