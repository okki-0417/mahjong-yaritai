"use client";

import { useNumberInput } from "@/src/hooks/useNumberInput";
import { FormControl, FormLabel, HStack, Input } from "@chakra-ui/react";
import { useMahjongSessionForm } from "@/src/app/me/participated-mahjong-sessions/new/contexts/MahjongSessionFormContextProvider";

export default function ChipAmountFormControl() {
  const { register, errors } = useMahjongSessionForm();
  const handleChipAmountInput = useNumberInput({ min: 0, max: 99999 });

  return (
    <HStack as={FormControl} gap="1" w="fit-content" isInvalid={Boolean(errors.chipAmount)}>
      <FormLabel m="0" htmlFor="chipAmount" fontSize={["sm", "md"]}>
        チップ
      </FormLabel>

      <Input
        {...register("chipAmount", { valueAsNumber: true })}
        display="inline-block"
        size="sm"
        fontSize={["lg", "xl"]}
        type="number"
        w="28"
        pr="1"
        onInput={handleChipAmountInput}
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
      <FormLabel m="0" htmlFor="chipAmount" fontSize={["sm", "md"]}>
        pt / 1枚
      </FormLabel>
    </HStack>
  );
}
