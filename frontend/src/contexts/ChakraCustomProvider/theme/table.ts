import { tableAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  tableAnatomy.keys,
);

const baseStyle = definePartsStyle({
  table: {
    variant: "striped",
    bg: "neutral.100",
    borderRadius: "md",
  },
  th: {
    fontFamily: "PT Serif, serif",
    color: "primary.500",
    px: "0",
  },
  td: {
    color: "primary.500",
    px: "0",
  },
});

export const tableTheme = defineMultiStyleConfig({ baseStyle });
