import { Box, Center, Container, HStack, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import Link from "next/link";
import ButtonNeutral from "@/src/components/Buttons/ButtonNeutral";
import LoginSection from "@/src/components/Header/LoginSection";
import { Fragment } from "react";
import SideNavigation from "@/src/components/Header/SideNavigation";
import LogoLink from "@/src/components/Header/LogoLink";
import LoginPromptBar from "@/src/components/Header/LoginPromptBar";

export default function Header() {
  return (
    <Fragment>
      <Box as="header" w="full" zIndex="50" position="fixed" top="0" left="0" shadow="md">
        <Center as="nav" h="16" position="relative" className="bg-primary">
          <Container maxW="5xl">
            <HStack
              justifyContent={["center", "center", "space-between"]}
              className="w-[70vw] mx-auto">
              <LogoLink />

              <UnorderedList listStyleType="none">
                <HStack display={["none", "none", "flex"]}>
                  <ListItem>
                    <Link href="/what-to-discard-problems">
                      <HStack gap="1">
                        <ButtonNeutral>
                          <HStack mx="0">
                            <Text>何切る問題</Text>
                          </HStack>
                        </ButtonNeutral>
                      </HStack>
                    </Link>
                  </ListItem>

                  <LoginSection />
                </HStack>
              </UnorderedList>
            </HStack>
          </Container>
        </Center>

        <SideNavigation />
        <LoginPromptBar />
      </Box>
    </Fragment>
  );
}
