"use client";

import ProfileEditModal from "@/src/components/Modals/ProfileEditModal";
import { FiEdit } from "react-icons/fi";
import { useDisclosure } from "@/src/hooks/useDisclosure";

export default function ProfileEditButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <button
        onClick={onOpen}
        className="p-2 rounded-sm border hover:bg-secondary-light"
      >
        <FiEdit size={22} color="white" />
      </button>

      <ProfileEditModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
