import { Box, Text, VStack } from "@chakra-ui/react";
import { Subsection } from "./Subsection";

interface SubsectionData {
  title: string;
  description?: string | string[];
  items?: string[];
}

interface SectionProps {
  title: string;
  description?: string | string[];
  subsections?: SubsectionData[];
}

export default function Section({ title, description, subsections }: SectionProps) {
  return (
    <Box>
      <Text fontSize={["lg", "xl"]} fontWeight="bold" mb="4">
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

      {subsections && (
        <VStack align="stretch" gap="6">
          {subsections.map((subsection, index) => (
            <Subsection
              key={index}
              title={subsection.title}
              description={subsection.description}
              items={subsection.items}
            />
          ))}
        </VStack>
      )}
    </Box>
  );
}
