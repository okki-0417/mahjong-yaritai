import { Container, ListItem, Text, UnorderedList, VStack } from "@chakra-ui/react";
import WithdrawForm from "@/src/app/me/withdrawal/components/WithdrawForm";

export default function WithdrawalPage() {
  return (
    <Container mt="20" maxW="2xl" mb="20">
      <Text as="h1" fontSize="2xl" fontWeight="bold" mb={6}>
        退会前の確認
      </Text>

      <VStack gap={6} align="stretch">
        <VStack align="start" gap={6}>
          <Text>
            退会すると、アカウントに関連するすべてのデータ（投稿、コメント、プロフィール情報など）が削除されます。
          </Text>

          <VStack align="start" gap={2}>
            <Text fontWeight="semibold">注意事項</Text>
            <VStack align="start" spacing={1}>
              <UnorderedList>
                <ListItem>
                  <Text>一度退会すると、データの復元はできません。</Text>
                </ListItem>
                <ListItem>
                  <Text>同じメールアドレスで再登録しても、過去のデータは引き継がれません。</Text>
                </ListItem>
                <ListItem>
                  <Text>退会処理は即座に実行されます。</Text>
                </ListItem>
              </UnorderedList>
            </VStack>
          </VStack>

          <Text>退会を希望される場合は、下の「退会する」ボタンを押してください。</Text>
        </VStack>

        <WithdrawForm />
      </VStack>
    </Container>
  );
}
