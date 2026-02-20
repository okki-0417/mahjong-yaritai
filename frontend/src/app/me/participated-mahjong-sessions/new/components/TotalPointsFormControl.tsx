import { Td, Text, VStack } from "@chakra-ui/react";

export default function TotalPointsFormControl({ participantUserFieldId, totalPoints }) {
  return (
    <Td
      as={VStack}
      key={participantUserFieldId}
      px="1"
      py={["2", "4"]}
      w="full"
      borderBottom=""
      _even={{ bg: "neutral.300" }}>
      <Text
        fontWeight="bold"
        fontSize={["xl", "2xl"]}
        color={totalPoints > 0 ? "blue.500" : totalPoints < 0 ? "red.500" : "inherit"}>
        {totalPoints}
      </Text>
    </Td>
  );
}
