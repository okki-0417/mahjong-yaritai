import { Box, Text, List, ListItem, VStack } from "@chakra-ui/react";

interface SubsectionProps {
  title: string;
  description?: string | string[];
  items?: string[];
}

export function Subsection({ title, description, items }: SubsectionProps) {
  return (
    <Box>
      <Text fontSize={["md", "lg"]} fontWeight="semibold" mb="3">
        {title}
      </Text>

      {description && (
        <VStack align="stretch" mb="3">
          {Array.isArray(description) ? (
            description.map((desc, index) => <Text key={index}>{desc}</Text>)
          ) : (
            <Text>{description}</Text>
          )}
        </VStack>
      )}

      {items && (
        <List spacing={3}>
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
