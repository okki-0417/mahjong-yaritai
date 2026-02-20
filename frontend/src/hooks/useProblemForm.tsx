"use client";

import PopButton from "@/src/components/PopButton";
import TileImage from "@/src/components/TileImage";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Text,
  Textarea,
  VisuallyHiddenInput,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import {
  CreateWhatToDiscardProblemInput,
  UpdateWhatToDiscardProblemInput,
  WhatToDiscardProblem,
} from "@/src/generated/graphql";
import { SubmitHandler, useForm } from "react-hook-form";

const MAX_TURN = 18;
const ALL_TILES_NUM = 34;
const handFieldNames = [
  "hand1Id",
  "hand2Id",
  "hand3Id",
  "hand4Id",
  "hand5Id",
  "hand6Id",
  "hand7Id",
  "hand8Id",
  "hand9Id",
  "hand10Id",
  "hand11Id",
  "hand12Id",
  "hand13Id",
] as const;

const tileFieldNames = [...handFieldNames, "tsumoId", "doraId"] as const;

type ProblemFormInputs = CreateWhatToDiscardProblemInput | UpdateWhatToDiscardProblemInput;

export default function useProblemForm(problem?: WhatToDiscardProblem) {
  const [currentFocussedTileField, setCurrentFocussedTileField] =
    useState<(typeof tileFieldNames)[number]>("hand1Id");
  const [detailSettingVisible, setDetailSettingVisible] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ProblemFormInputs>({
    defaultValues: {
      hand1Id: problem?.hand1Id || "",
      hand2Id: problem?.hand2Id || "",
      hand3Id: problem?.hand3Id || "",
      hand4Id: problem?.hand4Id || "",
      hand5Id: problem?.hand5Id || "",
      hand6Id: problem?.hand6Id || "",
      hand7Id: problem?.hand7Id || "",
      hand8Id: problem?.hand8Id || "",
      hand9Id: problem?.hand9Id || "",
      hand10Id: problem?.hand10Id || "",
      hand11Id: problem?.hand11Id || "",
      hand12Id: problem?.hand12Id || "",
      hand13Id: problem?.hand13Id || "",
      doraId: problem?.doraId || "",
      tsumoId: problem?.tsumoId || "",
      round: problem?.round || "",
      turn: problem?.turn || null,
      wind: problem?.wind || "",
      points: problem?.points ? Number(problem.points) : null,
      description: problem?.description || "",
    },
  });

  const tileFieldErrors = [
    errors?.hand1Id,
    errors?.hand2Id,
    errors?.hand3Id,
    errors?.hand4Id,
    errors?.hand5Id,
    errors?.hand6Id,
    errors?.hand7Id,
    errors?.hand8Id,
    errors?.hand9Id,
    errors?.hand10Id,
    errors?.hand11Id,
    errors?.hand12Id,
    errors?.hand13Id,
    errors?.tsumoId,
    errors?.doraId,
  ];

  const handleTileSelected = (tileId: string) => {
    setValue(currentFocussedTileField, tileId);

    const nextFocussedTileField = tileFieldNames.find(name => Boolean(getValues(name)) == false);
    if (nextFocussedTileField) setCurrentFocussedTileField(nextFocussedTileField);
  };

  const handleTileSelectionReset = () => {
    tileFieldNames.map(fieldName => setValue(fieldName, null));
    setCurrentFocussedTileField("hand1Id");
  };

  const TileDisplay = ({ fieldName }: { fieldName: typeof currentFocussedTileField }) => {
    return (
      <Box>
        <VisuallyHiddenInput
          {...register(fieldName, {
            required: "すべての牌を選択してください",
          })}
          readOnly
        />
        <button
          type="button"
          onClick={() => setCurrentFocussedTileField(fieldName)}
          className={`h-12 aspect-tile border rounded-sm ${
            currentFocussedTileField == fieldName
              ? "border-blue-500 shadow shadow-blue-500"
              : "border-secondary"
          }`}>
          {watch(fieldName) && <TileImage tileId={getValues(fieldName)} hover={false} />}
        </button>
      </Box>
    );
  };

  const BaseForm = ({ onSubmit }: { onSubmit: SubmitHandler<ProblemFormInputs> }) => (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-neutral text-primary">
      <VStack gap={6} align="stretch">
        <FormControl isRequired isInvalid={tileFieldErrors.some(Boolean)}>
          <VStack alignItems="start">
            <FormErrorMessage>{tileFieldErrors.find(Boolean)?.message}</FormErrorMessage>

            <Box>
              <FormLabel fontSize="lg" m="0">
                手牌
              </FormLabel>

              <Wrap gap="0" mt="2">
                {handFieldNames.map((fieldName, index) => (
                  <TileDisplay key={index} fieldName={fieldName} />
                ))}
              </Wrap>
            </Box>

            <HStack>
              <Box>
                <FormLabel fontSize="md" m="0">
                  <span>ツモ</span>
                </FormLabel>

                <TileDisplay fieldName="tsumoId" />
              </Box>

              <Box>
                <FormLabel fontSize="md" m="0">
                  <span>ドラ</span>
                </FormLabel>

                <TileDisplay fieldName="doraId" />
              </Box>
            </HStack>

            <PopButton className="form-button" onClick={() => handleTileSelectionReset()}>
              <Text as="span" fontSize={["md", "lg"]}>
                牌をリセット
              </Text>
            </PopButton>
          </VStack>

          <Divider borderColor="gray.500" variant="dashed" mt="6" />

          <Box mt="6">
            <Text fontSize="sm">牌をクリックして選ぶ</Text>
            <Wrap mt="1">
              {Array.from({ length: ALL_TILES_NUM }).map((_, index) => {
                const tileId = String(index + 1);
                return (
                  <Flex flexDir="column" alignItems="center" key={index}>
                    <PopButton
                      onClick={() => handleTileSelected(tileId)}
                      className="h-12 aspect-7/9 border  border-primary rounded-sm">
                      <TileImage tile={tileId} hover={false} />
                    </PopButton>
                  </Flex>
                );
              })}
            </Wrap>
          </Box>
        </FormControl>

        <Button onClick={() => setDetailSettingVisible(prev => !prev)}>詳細な設定</Button>

        <VStack>
          <FormControl>
            <Textarea
              {...register("description")}
              placeholder="問題にコメントを追加する（任意）"
              rows={5}
            />
          </FormControl>
        </VStack>

        <VStack spacing="6" display={detailSettingVisible ? "flex" : "none"}>
          <FormControl isInvalid={Boolean(errors.round)}>
            <VStack alignItems="start">
              <FormLabel fontSize="lg" m="0">
                局数
              </FormLabel>
              <VisuallyHiddenInput {...register("round")} readOnly />
              <FormErrorMessage>{errors.round?.message}</FormErrorMessage>
              <DisplayInput>{watch("round") && `${watch("round")}局`}</DisplayInput>

              <Wrap gap={2}>
                {["東一", "東二", "東三", "東四", "南一", "南二", "南三", "南四"].map(
                  (roundName, index) => {
                    return (
                      <PopButton
                        key={index}
                        onClick={() => setValue("round", roundName)}
                        className="form-button">
                        <Text as="span" fontSize="lg">
                          {roundName}
                        </Text>
                      </PopButton>
                    );
                  },
                )}
              </Wrap>

              <PopButton className="form-button" onClick={() => setValue("round", null)}>
                <Text as="span" fontSize="lg">
                  局数をリセット
                </Text>
              </PopButton>
            </VStack>
          </FormControl>

          <FormControl isInvalid={Boolean(errors.turn)}>
            <VStack alignItems="start">
              <FormLabel fontSize="lg" m="0">
                巡目
              </FormLabel>
              <FormErrorMessage>{errors.turn?.message}</FormErrorMessage>
              <VisuallyHiddenInput {...register("turn")} readOnly />
              <DisplayInput>{watch("turn") && `${getValues("turn")}巡目`}</DisplayInput>

              <Wrap gap={2}>
                {Array.from({ length: MAX_TURN }).map((_, index) => {
                  const turn = index + 1;
                  return (
                    <PopButton
                      onClick={() => setValue("turn", turn)}
                      className="form-button"
                      key={index}>
                      <Text fontSize="lg">{`${turn}巡目`}</Text>
                    </PopButton>
                  );
                })}
              </Wrap>

              <PopButton className="form-button" onClick={() => setValue("turn", null)}>
                <Text as="span" fontSize="lg">
                  巡目をリセット
                </Text>
              </PopButton>
            </VStack>
          </FormControl>

          <FormControl isInvalid={Boolean(errors.wind)}>
            <VStack alignItems="start">
              <FormLabel fontSize="lg" m="0">
                風
              </FormLabel>
              <FormErrorMessage>{errors.wind?.message}</FormErrorMessage>
              <VisuallyHiddenInput {...register("wind")} readOnly />
              <DisplayInput>{watch("wind") && `${getValues("wind")}家`}</DisplayInput>

              <Wrap gap={2}>
                {["東", "南", "西", "北"].map((windName, index) => {
                  return (
                    <PopButton
                      key={index}
                      onClick={() => setValue("wind", windName)}
                      className="form-button">
                      <Text fontSize="lg">{windName}</Text>
                    </PopButton>
                  );
                })}
              </Wrap>

              <PopButton className="form-button" onClick={() => setValue("wind", null)}>
                <Text as="span" fontSize="lg">
                  風をリセット
                </Text>
              </PopButton>
            </VStack>
          </FormControl>

          <FormControl isInvalid={Boolean(errors.points)}>
            <VStack alignItems="start">
              <Box>
                <FormLabel m="0" fontSize="xl">
                  持ち点
                </FormLabel>

                <FormErrorMessage>{errors.points?.message}</FormErrorMessage>

                <VisuallyHiddenInput {...register("points")} readOnly />

                <DisplayInput>
                  {watch("points") &&
                    new Intl.NumberFormat("en-US").format(Number(watch("points")))}
                </DisplayInput>
              </Box>

              <Wrap gap={2}>
                {[10000, 1000, 100, -10000, -1000, -100].map((addend, index) => (
                  <PopButton
                    key={index}
                    className="form-button"
                    onClick={() => setValue("points", Number(getValues("points")) + addend)}>
                    <Text as="span" fontSize="lg">
                      {`${addend > 0 ? "+" : ""} ${new Intl.NumberFormat("en-US").format(addend)}`}
                    </Text>
                  </PopButton>
                ))}
              </Wrap>

              <PopButton className="form-button" onClick={() => setValue("points", null)}>
                <Text as="span" fontSize="lg">
                  得点をリセット
                </Text>
              </PopButton>
            </VStack>
          </FormControl>
        </VStack>

        <Center>
          <Button type="submit" colorScheme="teal" size="lg" isLoading={isSubmitting}>
            作成する
          </Button>
        </Center>
      </VStack>
    </form>
  );

  return { BaseForm };
}

const DisplayInput = ({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <Text
      w="xs"
      minH="12"
      border="1px"
      borderColor="gray.400"
      py={2}
      px={4}
      fontSize="xl"
      width={40}
      borderRadius="md"
      bgColor="gray.50"
      className={className}
      onClick={onClick}>
      {children}
    </Text>
  );
};
