import { Container, Divider, Text, VStack } from "@chakra-ui/react";
import { Metadata } from "next";
import termsData from "@/src/app/terms/data/terms-data.json";
import Section from "@/src/app/terms/components/Section";

export const metadata: Metadata = {
  title: "利用規約",
  description:
    "麻雀ヤリタイの利用規約をご確認いただけます。本サービスをご利用いただく前に必ずお読みください。",
  openGraph: {
    title: "麻雀ヤリタイ - 利用規約",
    description: "麻雀ヤリタイの利用規約",
  },
};

export default function TermsPage() {
  return (
    <Container mt="20" maxW="4xl" mb="20">
      <Text as="h1" fontSize={["2xl", "4xl"]} fontWeight="bold">
        利用規約
      </Text>
      <Divider />

      <VStack mt="8" fontSize={["sm", "md"]} align="stretch" gap="12">
        {termsData.sections.map((section, index) => (
          <Section
            key={index}
            title={section.title}
            description={section.description}
            subsections={section.subsections}
          />
        ))}
      </VStack>
    </Container>
  );
}
