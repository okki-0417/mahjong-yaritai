"use client";

import { Grid, GridItem, HStack, ListItem, Text } from "@chakra-ui/react";
import Link from "next/link";

type Props = {
  href: string;
  icon: React.ReactNode;
  text: string;
};

export default function NavigationItem({ href, icon, text }: Props) {
  return (
    <ListItem>
      <Link href={href} className="w-full">
        <HStack className="py-3 px-4 rounded hover:bg-gray-600 transition-colors">
          <Grid w="full" h="full" templateColumns="repeat(8, 1fr)" alignItems="center">
            <GridItem colSpan={1}>{icon}</GridItem>
            <GridItem colSpan={7} textAlign="left">
              <Text fontWeight="bold">{text}</Text>
            </GridItem>
          </Grid>
        </HStack>
      </Link>
    </ListItem>
  );
}
