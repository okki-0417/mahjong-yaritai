"use client";

import { FormControl, Input } from "@chakra-ui/react";
import { useMahjongSessionForm } from "@/src/app/me/participated-mahjong-sessions/new/contexts/MahjongSessionFormContextProvider";

export default function CreatedDateFormControl() {
  const { register, errors } = useMahjongSessionForm();

  return (
    <FormControl isInvalid={Boolean(errors.createdDate)}>
      <Input
        type="date"
        size="md"
        fontSize={["lg", "xl"]}
        w="1/2"
        sx={{
          "&::-webkit-calendar-picker-indicator": {
            filter: "invert(1)",
          },
        }}
        {...register("createdDate")}
      />
    </FormControl>
  );
}
