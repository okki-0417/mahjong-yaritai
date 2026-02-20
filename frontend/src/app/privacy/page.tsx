import { Box, Container, Divider, Text, List, ListItem, VStack } from "@chakra-ui/react";
import { Metadata } from "next";
import privacyData from "./privacy-data.json";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description:
    "麻雀ヤリタイのプライバシーポリシー・個人情報の取扱いに関する基本方針をご確認いただけます。",
  openGraph: {
    title: "麻雀ヤリタイ - プライバシーポリシー",
    description: "麻雀ヤリタイのプライバシーポリシー・個人情報の取扱いに関する基本方針",
  },
};

interface ListSectionProps {
  title: string;
  description?: string | string[];
  items?: string[];
}

function ListSection({ title, description, items }: ListSectionProps) {
  return (
    <Box mb="8">
      <Text fontSize={["lg", "xl"]} as="h1" fontWeight="bold" mb="4">
        {title}
      </Text>

      {description && (
        <VStack align="stretch" mb="4">
          {Array.isArray(description) ? (
            description.map((desc, index) => <Text key={index}>{desc}</Text>)
          ) : (
            <Text>{description}</Text>
          )}
        </VStack>
      )}

      {items && (
        <List spacing={4}>
          {items.map((item, index) => (
            <ListItem key={index} listStyleType="disc" listStylePos="inside">
              {item}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

export default function PrivacyPage() {
  return (
    <Container mt="20" maxW="4xl" mb="20">
      <Text as="h1" fontSize={["2xl", "4xl"]} fontWeight="bold">
        プライバシーポリシー
      </Text>
      <Divider />

      <Box mt="8" fontSize={["sm", "md"]}>
        {privacyData.sections.map((section, index) => (
          <Box key={index} mt={index > 0 ? "12" : "0"}>
            <ListSection
              title={section.title}
              description={section.description}
              items={section.items}
            />
          </Box>
        ))}
      </Box>
    </Container>
  );
}
