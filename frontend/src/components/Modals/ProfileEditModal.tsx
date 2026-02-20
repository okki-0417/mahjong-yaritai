"use client";

import ProfileEditForm from "@/src/app/me/profile/edit/components/ProfileEditForm";
import { User } from "@/src/generated/graphql";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  profile: User;
};

export default function ProfileEditModal({ isOpen, onClose, profile }: Props) {
  const router = useRouter();
  const handleUpdated = () => {
    router.refresh();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent bg="neutral.100" fontFamily="PT Serif, serif">
        <ModalHeader>プロフィール編集</ModalHeader>

        <ModalCloseButton />

        <ModalBody>
          <ProfileEditForm user={profile} onUpdated={handleUpdated} />
        </ModalBody>

        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
