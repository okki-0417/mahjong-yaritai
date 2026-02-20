import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Card,
  CardBody,
  Container,
  HStack,
  SimpleGrid,
  Skeleton,
  VStack,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa6";

function MahjongSessionCardSkeleton() {
  return (
    <Card>
      <CardBody py={["3", "3"]} px={["3", "6"]} bg="neutral.100" borderRadius="md" boxShadow="base">
        {/* 日付 */}
        <Skeleton height="24px" width="180px" mb="2" />

        {/* 総収支・着順 */}
        <SimpleGrid columns={2} alignItems="baseline" gap="2">
          <HStack gap="1" alignItems="baseline">
            <Skeleton height="12px" width="40px" />
            <Skeleton height="32px" width="60px" />
          </HStack>
          <HStack gap="1" alignItems="baseline">
            <Skeleton height="12px" width="30px" />
            <Skeleton height="32px" width="40px" />
          </HStack>
        </SimpleGrid>

        {/* 1-4位 */}
        <SimpleGrid columns={4} alignItems="baseline" mt="2" gap="2">
          {[...Array(4)].map((_, i) => (
            <HStack key={i} gap="1" alignItems="baseline">
              <Skeleton height="12px" width="24px" />
              <Skeleton height="20px" width="32px" />
            </HStack>
          ))}
        </SimpleGrid>

        {/* 参加者 */}
        <HStack gap="2" mt="2">
          <Skeleton height="12px" width="40px" />
          <Skeleton height="20px" width="200px" />
        </HStack>
      </CardBody>
    </Card>
  );
}

export default function Loading() {
  return (
    <Container maxW="container.xl" py={4} px="0">
      <Box px="2">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/me">マイページ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink isCurrentPage>麻雀戦績</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>

      <Container mt="4" maxW="container.md" px="1">
        <HStack justifyContent="end" mb="4">
          <Button colorScheme="pink" leftIcon={<FaPlus />} isDisabled>
            新しい戦績を追加する
          </Button>
        </HStack>

        <VStack spacing={4} align="stretch">
          {[...Array(3)].map((_, i) => (
            <MahjongSessionCardSkeleton key={i} />
          ))}
        </VStack>
      </Container>
    </Container>
  );
}
