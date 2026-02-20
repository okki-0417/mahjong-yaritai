"use client";

import { useNumberInput } from "@/src/hooks/useNumberInput";
import { FormControl, FormLabel, HStack, Input } from "@chakra-ui/react";
import { useMahjongSessionForm } from "@/src/app/me/participated-mahjong-sessions/new/contexts/MahjongSessionFormContextProvider";

export default function RateFormControl() {
  const { register, errors } = useMahjongSessionForm();
  const handleRateInput = useNumberInput({ min: 0, max: 99999 });

  return (
    <HStack
      as={FormControl}
      align="baseline"
      gap="1"
      isInvalid={Boolean(errors.rate)}
      w="fit-content">
      <FormLabel m="0" htmlFor="rate" fontSize={["sm", "md"]}>
        レート
      </FormLabel>

      <Input
        {...register("rate", { valueAsNumber: true })}
        type="number"
        size="sm"
        display="inline-block"
        fontSize={["lg", "xl"]}
        w="28"
        pr="1"
        onInput={handleRateInput}
        sx={{
          "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
          "&[type=number]": {
            MozAppearance: "textfield",
          },
        }}
      />
      <FormLabel m="0" htmlFor="rate" fontSize={["sm", "md"]}>
        pt / 1000点
      </FormLabel>
    </HStack>
  );
}
