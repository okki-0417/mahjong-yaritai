import { Button } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function ButtonSecondary({ children = "ボタン" }: { children: ReactNode }) {
  return (
    <Button colorScheme="" bgColor="#364153" _hover={{ bgColor: "#466163" }}>
      {children}
    </Button>
  );
}
