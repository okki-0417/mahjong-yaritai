import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  CardBody,
  Container,
  HStack,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  VStack,
} from "@chakra-ui/react";

export default function Loading() {
  return (
    <Container maxW="container.xl" py="4">
      <Breadcrumb>
        <BreadcrumbItem>
          <Skeleton height="20px" width="80px" />
        </BreadcrumbItem>
      </Breadcrumb>

      <Container maxW="container.md" px="0" mt="4">
        <VStack spacing={6} align="stretch">
          {/* プロフィール編集ボタン・メニュー */}
          <Box>
            <HStack justify="end" gap="2" mb="2">
              <Skeleton height="32px" width="32px" borderRadius="md" />
              <Skeleton height="32px" width="32px" borderRadius="md" />
            </HStack>
            {/* アバター + 名前 */}
            <HStack justify="start" w="full" gap="4">
              <SkeletonCircle size="16" />
              <Skeleton height="24px" width="120px" />
            </HStack>
          </Box>

          {/* 自己紹介文 */}
          <SkeletonText noOfLines={2} spacing="2" skeletonHeight="14px" />

          {/* フォロー統計 */}
          <HStack justify="start" gap="4">
            <Skeleton height="20px" width="80px" />
            <Skeleton height="20px" width="80px" />
          </HStack>

          {/* メニューカード */}
          <VStack spacing={4} align="stretch" mt="8">
            <Card bg="secondary.300">
              <CardBody>
                <Skeleton height="20px" width="150px" />
              </CardBody>
            </Card>
            <Card bg="secondary.300">
              <CardBody>
                <Skeleton height="20px" width="100px" />
              </CardBody>
            </Card>
          </VStack>
        </VStack>
      </Container>
    </Container>
  );
}
