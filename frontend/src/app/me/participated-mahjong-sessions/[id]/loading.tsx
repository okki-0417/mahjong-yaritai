import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
  HStack,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  VStack,
} from "@chakra-ui/react";

export default function Loading() {
  return (
    <Box>
      <Container maxW="container.xl" mb="4" px="1" mt="2">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/me">マイページ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/me/participated-mahjong-sessions">麻雀戦績</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Skeleton height="20px" width="120px" />
          </BreadcrumbItem>
        </Breadcrumb>
      </Container>

      <Container px="0" maxW="container.md" mt="2">
        <Box px="1">
          {/* 日付 */}
          <Skeleton height="36px" width="200px" mb="2" />

          {/* レート・チップ */}
          <HStack mb="1" gap="4">
            <HStack align="baseline" gap="1">
              <Skeleton height="14px" width="40px" />
              <Skeleton height="24px" width="40px" />
            </HStack>
            <HStack align="baseline" gap="1">
              <Skeleton height="14px" width="40px" />
              <Skeleton height="24px" width="40px" />
            </HStack>
          </HStack>
        </Box>

        {/* テーブル */}
        <Box borderRadius={["sm", "md"]} bg="neutral.100" boxShadow="lg" overflow="hidden">
          {/* ヘッダー（参加者アバター） */}
          <HStack gap="0" align="stretch">
            <Box w={["10", "16"]} borderRightWidth="1.5px" borderColor="secondary.50" />
            <SimpleGrid columns={4} w="full" p="2">
              {[...Array(4)].map((_, i) => (
                <VStack key={i} spacing="2" py="2">
                  <SkeletonCircle size={["8", "12"]} />
                  <Skeleton height="16px" width="50px" />
                </VStack>
              ))}
            </SimpleGrid>
          </HStack>

          {/* Divider */}
          <Box borderWidth="2px" borderColor="#060" />

          {/* ゲーム行 */}
          <VStack spacing="0" align="stretch">
            {[...Array(4)].map((__, rowIdx) => (
              <HStack
                key={rowIdx}
                gap="0"
                align="stretch"
                borderBottomWidth="1.5px"
                borderColor="secondary.50">
                <VStack w={["10", "16"]} py="4" borderRightWidth="1.5px" borderColor="secondary.50">
                  <Skeleton height="20px" width="20px" />
                </VStack>
                <SimpleGrid columns={4} w="full">
                  {[...Array(4)].map((_, colIdx) => (
                    <VStack key={colIdx} py="2" px="1" _even={{ bg: "neutral.300" }}>
                      <Skeleton height="28px" width="50px" />
                    </VStack>
                  ))}
                </SimpleGrid>
              </HStack>
            ))}
          </VStack>

          {/* Divider */}
          <Box borderWidth="2px" borderColor="#060" />

          {/* フッター（合計・平均順位・収支） */}
          <VStack spacing="0" align="stretch">
            {["合計", "平均順位", "収支"].map((__, rowIdx) => (
              <HStack
                key={rowIdx}
                gap="0"
                align="stretch"
                borderBottomWidth="1.5px"
                borderColor="secondary.50">
                <VStack w={["10", "16"]} py="4" borderRightWidth="1.5px" borderColor="secondary.50">
                  <Skeleton height="14px" width="30px" />
                </VStack>
                <SimpleGrid columns={4} w="full">
                  {[...Array(4)].map((_, colIdx) => (
                    <VStack key={colIdx} py="4" px="1" _even={{ bg: "neutral.300" }}>
                      <Skeleton height="28px" width="50px" />
                    </VStack>
                  ))}
                </SimpleGrid>
              </HStack>
            ))}
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
