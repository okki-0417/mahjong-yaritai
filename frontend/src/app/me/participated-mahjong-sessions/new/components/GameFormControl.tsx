"use client";

import GameResultFormControl from "@/src/app/me/participated-mahjong-sessions/new/components/GameResultFormControl";
import {
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Text,
  Th,
  Tooltip,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { useMahjongSessionForm } from "@/src/app/me/participated-mahjong-sessions/new/contexts/MahjongSessionFormContextProvider";

type Props = {
  gameIndex: number;
};

export default function GameFormControl({ gameIndex }: Props) {
  const { participantUserFields, errors, watch, register, removeGame } = useMahjongSessionForm();
  const gameResultPoints = watch(`games.${gameIndex}.results`);
  const gameError = errors.games?.[gameIndex];

  const totalPoints = gameResultPoints.reduce((sum, result) => {
    const points = result?.resultPoints;
    if (typeof points === "number" && !Number.isNaN(points)) {
      return sum + points;
    }
    return sum;
  }, 0);

  const isBalanced = totalPoints === 0;

  return (
    <Tr as={HStack} gap="0" align="stretch" borderBottom="0">
      <Th
        as={VStack}
        w={["10", "16"]}
        p="0"
        borderBottom=""
        color="primary.500"
        alignItems="stretch"
        justifyContent="center"
        borderColor="secondary.50"
        borderRightWidth="1.5px"
        bg={isBalanced ? undefined : "yellow.200"}>
        <Menu>
          <Tooltip
            label={
              isBalanced
                ? "クリックで削除"
                : `収支が合いません (${totalPoints > 0 ? "+" : ""}${totalPoints})`
            }
            hasArrow>
            <MenuButton
              as={Text}
              cursor="pointer"
              _hover={{ opacity: 0.7 }}
              py={["2", "4"]}
              fontSize={["md", "xl"]}
              textAlign="center">
              {gameIndex + 1}
            </MenuButton>
          </Tooltip>
          <MenuList>
            <MenuItem color="red.500" onClick={() => removeGame(gameIndex)}>
              このゲームを削除
            </MenuItem>
          </MenuList>
        </Menu>
      </Th>

      <SimpleGrid as="div" columns={participantUserFields.length} w="full" alignItems="stretch">
        {participantUserFields.map((participantUserField, participantIndex) => (
          <GameResultFormControl
            key={participantUserField.id}
            gameResultError={gameError?.results?.[participantIndex]}
            resultPoints={gameResultPoints[participantIndex]?.resultPoints}
            register={register}
            gameIndex={gameIndex}
            participantIndex={participantIndex}
          />
        ))}
      </SimpleGrid>
    </Tr>
  );
}
