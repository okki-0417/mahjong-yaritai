"use client";

import { FaDeleteLeft } from "react-icons/fa6";
import { SlLogin } from "react-icons/sl";
import NavigationItem from "@/src/components/Header/SideNavigation/NavigationItem";
import useGetSession from "@/src/hooks/useGetSession";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  ListItem,
  Text,
  UnorderedList,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { GiHamburgerMenu, GiThink } from "react-icons/gi";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import LogoutButton from "@/src/components/Header/SideNavigation/LogoutButton";

export default function SideNavigation() {
  const { session } = useGetSession();
  const isLoggedIn = session?.isLoggedIn;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const pathName = usePathname();

  useEffect(() => {
    onClose();
  }, [pathName, onClose]);

  return (
    <>
      <Button onClick={onOpen} position="absolute" insetY="3" right="4" zIndex="60" colorScheme="">
        <GiHamburgerMenu size={30} />
      </Button>

      <Drawer placement="right" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />

        <DrawerContent className="*:bg-primary-light" fontFamily="serif" color="white">
          <DrawerCloseButton onClick={onClose} color="white" size="lg" />

          <DrawerHeader />

          <DrawerBody pl="0" pt="4">
            <UnorderedList listStyleType="none">
              <VStack alignItems="stretch" w="full" gap="1">
                {!isLoggedIn && (
                  <ListItem>
                    <Link href="/auth/request" className="w-full">
                      <HStack className="py-3 px-4 rounded bg-pink-500/50 hover:bg-pink-300/50 transition-colors">
                        <SlLogin size={20} color="white" />
                        <Text fontWeight="bold">ログイン/新規登録</Text>
                      </HStack>
                    </Link>
                  </ListItem>
                )}

                <NavigationItem
                  href="/what-to-discard-problems"
                  icon={<GiThink size={25} color="white" />}
                  text="何切る問題"
                />
              </VStack>
            </UnorderedList>
          </DrawerBody>

          <DrawerFooter pl="0">
            <UnorderedList listStyleType="none" w="full">
              <VStack borderTop="1px" pt="2" alignItems="stretch" w="full" gap="1">
                <NavigationItem
                  href="/privacy"
                  icon={<MdOutlinePrivacyTip size={20} color="white" />}
                  text="プライバシーポリシー"
                />

                <NavigationItem
                  href="/terms"
                  icon={<IoDocumentTextOutline size={20} color="white" />}
                  text="利用規約"
                />

                {isLoggedIn && (
                  <>
                    <ListItem>
                      <LogoutButton />
                    </ListItem>

                    <NavigationItem
                      href="/me/withdrawal"
                      icon={<FaDeleteLeft size={20} color="white" />}
                      text="アカウント削除"
                    />
                  </>
                )}
              </VStack>
            </UnorderedList>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
