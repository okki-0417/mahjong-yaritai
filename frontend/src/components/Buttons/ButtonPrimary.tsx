import { Button } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function ButtonPrimary({ children = "ボタン" }: { children: ReactNode }) {
  return (
    <Button colorScheme="" bgColor="#171923" _hover={{ bgColor: "#272933" }}>
      {children}
    </Button>
  );
}
