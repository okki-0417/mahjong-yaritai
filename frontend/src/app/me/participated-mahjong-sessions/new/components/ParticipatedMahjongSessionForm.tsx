"use client";

import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  HStack,
  Stack,
  Table,
  Tbody,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useTransition } from "react";
import { SubmitHandler } from "react-hook-form";
import createMahjongSessionAction from "@/src/app/me/participated-mahjong-sessions/new/actions/createMahjongSessionAction";
import RateFormControl from "@/src/app/me/participated-mahjong-sessions/new/components/RateFormControl";
import ChipAmountFormControl from "@/src/app/me/participated-mahjong-sessions/new/components/ChipAmountFormControl";
import CreatedDateFormControl from "@/src/app/me/participated-mahjong-sessions/new/components/CreatedDateFormControl";
import ParticipantUsersSection from "@/src/app/me/participated-mahjong-sessions/new/components/ParticipantUsersSection";
import AddParticipantUserButton from "@/src/app/me/participated-mahjong-sessions/new/components/AddParticipantUserButon";
import GameFormControl from "@/src/app/me/participated-mahjong-sessions/new/components/GameFormControl";
import AddGameButton from "@/src/app/me/participated-mahjong-sessions/new/components/AddGameButton";
import TotalPointsFormControls from "@/src/app/me/participated-mahjong-sessions/new/components/TotalPointsFormControls";
import AverageRakingFormControls from "@/src/app/me/participated-mahjong-sessions/new/components/AverageRakingFormControls";
import TotalProfitsFormControls from "@/src/app/me/participated-mahjong-sessions/new/components/TotalProfitsFormControls";
import { useMahjongSessionForm } from "@/src/app/me/participated-mahjong-sessions/new/contexts/MahjongSessionFormContextProvider";
import useMahjongSessionDraft from "@/src/app/me/participated-mahjong-sessions/new/hooks/useMahjongSessionDraft";
import useBeforeUnloadWarning from "@/src/app/me/participated-mahjong-sessions/new/hooks/useBeforeUnloadWarning";
import { GameSessionFormType } from "@/src/app/me/participated-mahjong-sessions/new/types";
import { FaCheck } from "react-icons/fa6";
import { RiResetLeftFill } from "react-icons/ri";

const isValidResult = (result: { resultPoints: number | null; ranking: number | null }) =>
  typeof result.resultPoints === "number" &&
  !Number.isNaN(result.resultPoints) &&
  typeof result.ranking === "number" &&
  !Number.isNaN(result.ranking);

export default function ParticipatedMahjongSessionForm() {
  const { handleSubmit, gameFields, participantUserFields, formState, watch, reset } =
    useMahjongSessionForm();
  const [isPending, startTransition] = useTransition();
  const toast = useToast();

  const { clearDraft, resetAll, isResetting } = useMahjongSessionDraft({ watch, reset });
  useBeforeUnloadWarning({ isDirty: formState.isDirty });

  const onSubmit: SubmitHandler<GameSessionFormType> = formData => {
    const filteredGames = formData.games.map(game => ({
      results: game.results.filter(isValidResult).map(result => ({
        resultPoints: result.resultPoints as number,
        ranking: result.ranking as number,
      })),
    }));

    startTransition(async () => {
      const result = await createMahjongSessionAction({
        rate: formData.rate,
        chipAmount: formData.chipAmount,
        createdDate: formData.createdDate,
        participantUsers: formData.participantUsers.map(user => ({
          userId: user.userId,
          name: user.name,
          avatarUrl: user.avatarUrl,
        })),
        games: filteredGames,
      });

      if (result.success) {
        clearDraft();
        toast({
          title: "保存しました",
          status: "success",
        });
      } else {
        toast({
          title: "保存に失敗しました",
          description: result.errors.join(", "),
          status: "error",
        });
      }
    });
  };

  return (
    <Container px="0" maxW="container.md" mt="2">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box px="1">
          <CreatedDateFormControl />

          <Stack flexDir={["column", "row"]} gap={["1", "5"]} mt="4" mb="2">
            <RateFormControl />
            <ChipAmountFormControl />
          </Stack>
        </Box>

        <HStack gap="0" align="stretch" mt="4">
          <Table
            as="div"
            borderRadius=""
            borderLeftRadius={["sm", "md"]}
            bg="neutral.100"
            boxShadow="lg"
            overflow="hidden">
            <Thead as="div" position="relative">
              <Tr as={HStack} gap="0" align="stretch">
                <Th
                  as="div"
                  px="0"
                  w={["10", "16"]}
                  borderColor="secondary.50"
                  borderBottom=""
                  borderRightWidth="1.5px"
                />
                <ParticipantUsersSection />
              </Tr>
            </Thead>
            <Divider borderWidth="2px" borderColor="#060" />
            <Tbody
              as={VStack}
              align="stretch"
              spacing="0"
              position="relative"
              divider={<Divider borderColor="secondary.50" borderBottomWidth="1.5px" />}>
              {gameFields.map((gameField, gameIndex) => (
                <GameFormControl key={gameField.id} gameIndex={gameIndex} />
              ))}
              <AddGameButton />
            </Tbody>
            <Divider borderWidth="2px" borderColor="#060" />
            <Tfoot as="div">
              <Tr as={HStack} gap="0" align="stretch">
                <Th
                  as={Center}
                  p="0"
                  w={["10", "16"]}
                  borderColor="secondary.50"
                  borderBottom=""
                  borderRightWidth="1.5px"
                  color="primary.500"
                  fontSize={["xs", "sm"]}>
                  <Text>合計</Text>
                </Th>
                <TotalPointsFormControls />
              </Tr>
              <Divider borderColor="secondary.50" />
              <Tr as={HStack} gap="0" align="stretch">
                <Th
                  as={Center}
                  px="0"
                  w={["10", "16"]}
                  py="0"
                  borderBottom=""
                  borderColor="secondary.50"
                  color="primary.500"
                  borderRightWidth="1.5px">
                  <Text fontSize={["xs", "sm"]}>
                    平均
                    <br />
                    順位
                  </Text>
                </Th>
                <AverageRakingFormControls />
              </Tr>
              <Divider borderColor="secondary.50" />
              <Tr as={HStack} gap="0" align="stretch">
                <Th
                  as={Center}
                  px="0"
                  w={["10", "16"]}
                  py={["2", "4"]}
                  borderBottom=""
                  borderColor="secondary.50"
                  color="primary.500"
                  borderRightWidth="1.5px">
                  <Text fontSize={["xs", "sm"]}>収支</Text>
                </Th>
                <TotalProfitsFormControls />
              </Tr>
            </Tfoot>
          </Table>

          {participantUserFields.length < 6 && <AddParticipantUserButton />}
        </HStack>

        <HStack mt="4" gap="2">
          <Button
            size={["sm", "md"]}
            leftIcon={<RiResetLeftFill />}
            colorScheme="yellow"
            variant="outline"
            color="white"
            _hover={{ bg: "yellow.400", color: "primary.500" }}
            isLoading={isResetting}
            onClick={resetAll}>
            リセット
          </Button>

          <Button
            size={["sm", "md"]}
            leftIcon={<FaCheck />}
            type="submit"
            colorScheme="pink"
            isLoading={isPending}>
            保存
          </Button>
        </HStack>
      </form>
    </Container>
  );
}
