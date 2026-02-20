import { tableTheme } from "@/src/contexts/ChakraCustomProvider/theme/table";
import { extendTheme } from "@chakra-ui/react";

const styles = {
  global: {
    body: {
      fontFamily: "PT Sans, sans-serif",
    },
  },
};

const colors = {
  primary: {
    300: "#272933",
    500: "#171923",
  },
  secondary: {
    50: "#a0b0b0",
    100: "#749395",
    300: "#466163",
    500: "#365158",
  },
  accent: {
    300: "#ff77cc",
    500: "#fb64b6",
  },
  neutral: {
    50: "#fff",
    100: "#f9f9f9",
    200: "#f0f0f0",
    300: "#e7eaeC",
    400: "#d4d7d9",
    500: "#c1c5c7",
  },
};

const components = {
  Table: tableTheme,
};

export const customTheme = extendTheme({ styles, colors, components });
