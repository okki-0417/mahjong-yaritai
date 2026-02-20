"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { useDisclosure } from "@chakra-ui/react";

type ParticipantUsersModalContextType = {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  openModal: (participantIndex: number) => void;
  participantUserIndex: number | null;
};

const ParticipantUsersModalContext = createContext<ParticipantUsersModalContextType | null>(null);

type Props = {
  children: ReactNode;
};

export default function ParticipantUsersModalContextProvider({ children }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [participantUserIndex, setParticipantUserIndex] = useState<number | null>(null);

  const openModal = (participantIndex: number) => {
    setParticipantUserIndex(participantIndex);
    onOpen();
  };

  const value: ParticipantUsersModalContextType = {
    isOpen,
    onClose,
    openModal,
    participantUserIndex,
  };

  return (
    <ParticipantUsersModalContext.Provider value={value}>
      {children}
    </ParticipantUsersModalContext.Provider>
  );
}

export function useParticipantUsersModal() {
  const context = useContext(ParticipantUsersModalContext);
  if (!context) {
    throw new Error(
      "useParticipantUsersModal must be used within ParticipantUsersModalContextProvider",
    );
  }
  return context;
}
