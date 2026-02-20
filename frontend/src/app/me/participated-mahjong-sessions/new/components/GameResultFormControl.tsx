"use client";

import { GameSessionFormType } from "@/src/app/me/participated-mahjong-sessions/new/types";
import { useNumberInput } from "@/src/hooks/useNumberInput";
import {
  Editable,
  EditableInput,
  EditablePreview,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  Td,
  VisuallyHiddenInput,
} from "@chakra-ui/react";
import { FieldErrors } from "react-hook-form";
import { useMahjongSessionForm } from "@/src/app/me/participated-mahjong-sessions/new/contexts/MahjongSessionFormContextProvider";
import { calculateRanking } from "@/src/app/me/participated-mahjong-sessions/new/utils/calculateRanking";

type Props = {
  gameResultError: FieldErrors<GameSessionFormType>["games"][number]["results"][number];
  resultPoints: number;
  register: any;
  gameIndex: number;
  participantIndex: number;
};

export default function GameResultFormControl({
  gameResultError,
  resultPoints,
  register,
  gameIndex,
  participantIndex,
}: Props) {
  const { watch, setValue } = useMahjongSessionForm();
  const handleResultPointsInput = useNumberInput({ min: -999, max: 999 });

  const handleResultPointsChange = () => {
    const gameResults = watch(`games.${gameIndex}.results`);

    const calculated = calculateRanking(gameResults);

    calculated.forEach((calc, idx) => {
      setValue(`games.${gameIndex}.results.${idx}.ranking`, calc.ranking);
    });
  };

  return (
    <Td
      as={HStack}
      borderBottom=""
      _odd={{ bg: "neutral.200", _hover: { bg: "neutral.300" } }}
      _even={{ bg: "neutral.300", _hover: { bg: "neutral.400" } }}
      p="0"
      alignItems="stretch"
      justifyContent="stretch">
      <FormControl isInvalid={Boolean(gameResultError)}>
        <VisuallyHiddenInput
          {...register(`games.${gameIndex}.results.${participantIndex}.ranking` as const, {
            valueAsNumber: true,
          })}
        />
        <HStack
          as={Editable}
          value={resultPoints != null && !Number.isNaN(resultPoints) ? String(resultPoints) : ""}
          h="full"
          w="full"
          minH={["10", "14"]}>
          <HStack
            as={EditablePreview}
            cursor="pointer"
            fontWeight="bold"
            fontSize={["xl", "2xl"]}
            textAlign="center"
            w="full"
            h="full"
            p="0"
            justify="center"
            color={resultPoints > 0 ? "blue.500" : resultPoints < 0 ? "red.500" : "inherit"}
          />
          <Input
            as={EditableInput}
            type="number"
            fontWeight="bold"
            fontSize={["xl", "2xl"]}
            px={[0, 2]}
            textAlign="center"
            sx={{
              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                WebkitAppearance: "none",
                margin: 0,
              },
              "&[type=number]": {
                MozAppearance: "textfield",
              },
            }}
            {...register(`games.${gameIndex}.results.${participantIndex}.resultPoints` as const, {
              valueAsNumber: true,
              onChange: handleResultPointsChange,
            })}
            onInput={handleResultPointsInput}
          />
        </HStack>
        <FormErrorMessage>{gameResultError?.message}</FormErrorMessage>
      </FormControl>
    </Td>
  );
}
