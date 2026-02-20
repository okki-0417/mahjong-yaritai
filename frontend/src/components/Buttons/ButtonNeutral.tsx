import { Button } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function ButtonNeutral({ children = "ボタン" }: { children: ReactNode }) {
  return (
    <Button colorScheme="" _hover={{ bgColor: "#364153" }}>
      {children}
    </Button>
  );
}
