import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
  HStack,
  Skeleton,
  SkeletonCircle,
  Stack,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";

export default function Loading() {
  return (
    <Container maxW="container.xl" py="2" px="1">
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} href="/me">
            マイページ
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} href="/me/participated-mahjong-sessions">
            麻雀戦績
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink isCurrentPage>新しい戦績</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Container px="0" maxW="container.md" mt="2">
        <Box px="1">
          {/* 日付 */}
          <Skeleton height="40px" width="200px" />

          {/* レート・チップ */}
          <Stack flexDir={["column", "row"]} gap={["1", "5"]} mt="4" mb="2">
            <Skeleton height="40px" width="150px" />
            <Skeleton height="40px" width="150px" />
          </Stack>
        </Box>

        {/* テーブル */}
        <Box mt="4" bg="neutral.100" borderRadius={["sm", "md"]} boxShadow="lg" overflow="hidden">
          {/* ヘッダー（参加者アバター） */}
          <HStack p="4" justify="center" gap="4">
            {[...Array(4)].map((_, i) => (
              <VStack key={i} spacing="2">
                <SkeletonCircle size="12" />
                <Skeleton height="16px" width="60px" />
              </VStack>
            ))}
          </HStack>

          {/* ゲーム行 */}
          <VStack spacing="0" align="stretch" p="2">
            {[...Array(3)].map((__, rowIdx) => (
              <HStack key={rowIdx} p="2" justify="center" gap="4">
                <Skeleton height="12px" width="20px" />
                {[...Array(4)].map((_, colIdx) => (
                  <Skeleton key={colIdx} height="40px" width="60px" />
                ))}
              </HStack>
            ))}
          </VStack>

          {/* フッター（合計・平均順位・収支） */}
          <VStack spacing="2" p="4">
            <HStack justify="center" gap="4">
              <Skeleton height="12px" width="30px" />
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} height="24px" width="60px" />
              ))}
            </HStack>
            <HStack justify="center" gap="4">
              <Skeleton height="12px" width="30px" />
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} height="24px" width="60px" />
              ))}
            </HStack>
            <HStack justify="center" gap="4">
              <Skeleton height="12px" width="30px" />
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} height="24px" width="60px" />
              ))}
            </HStack>
          </VStack>
        </Box>

        {/* ボタン */}
        <HStack mt="4" gap="2">
          <Skeleton height="40px" width="100px" borderRadius="md" />
          <Skeleton height="40px" width="80px" borderRadius="md" />
        </HStack>
      </Container>
    </Container>
  );
}
