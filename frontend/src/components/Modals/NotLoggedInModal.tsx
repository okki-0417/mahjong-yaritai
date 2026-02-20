"use client";

import {
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import ButtonAccent from "@/src/components/Buttons/ButtonAccent";

export default function NotLoggedInModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      blockScrollOnMount={false}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size={["xs", "2xl"]}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontFamily="serif">未ログイン</ModalHeader>

        <ModalCloseButton className="text-primary" />

        <ModalBody className="text-primary" fontFamily="serif">
          <Text>この機能はログインしている時のみ利用できます。</Text>

          <HStack mt="4">
            <Link href="/auth/request">
              <ButtonAccent>認証</ButtonAccent>
            </Link>
          </HStack>
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
