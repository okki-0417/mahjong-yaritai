import CreateProblemButton from "@/src/app/what-to-discard-problems/components/ProblemSection/ProblemSideNavigation/CreateProblemButton";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  ListItem,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";

export default function ProblemsSideNavigation() {
  return (
    <Card>
      <CardHeader pb="0">
        <Heading fontFamily="serif" size="md">
          何切る問題
        </Heading>
      </CardHeader>

      <CardBody pl="0" pt="2">
        <UnorderedList listStyleType="none">
          <VStack spacing="0" align="stretch" divider={<Divider />}>
            <ListItem>
              <CreateProblemButton />
            </ListItem>
          </VStack>
        </UnorderedList>
      </CardBody>
    </Card>
  );
}
