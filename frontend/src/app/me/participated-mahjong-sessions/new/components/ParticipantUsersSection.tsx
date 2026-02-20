"use client";

import { SimpleGrid } from "@chakra-ui/react";
import ParticipantUserFormControl from "@/src/app/me/participated-mahjong-sessions/new/components/ParticipantUserFormControl";
import ParticipantUsersModal from "@/src/app/me/participated-mahjong-sessions/new/components/ParticipantUsersModal";
import { useMahjongSessionForm } from "@/src/app/me/participated-mahjong-sessions/new/contexts/MahjongSessionFormContextProvider";
import ParticipantUsersModalContextProvider, {
  useParticipantUsersModal,
} from "@/src/app/me/participated-mahjong-sessions/new/contexts/ParticipantUsersModalContextProvider";

function ParticipantUsersSectionContent() {
  const { participantUserFields } = useMahjongSessionForm();
  const { isOpen, onClose, participantUserIndex } = useParticipantUsersModal();

  return (
    <>
      <SimpleGrid columns={participantUserFields.length} w="full">
        {participantUserFields.map((participantUserField, index) => (
          <ParticipantUserFormControl key={participantUserField.id} participantUserIndex={index} />
        ))}
      </SimpleGrid>

      {participantUserIndex !== null && (
        <ParticipantUsersModal
          isOpen={isOpen}
          onClose={onClose}
          participantUserIndex={participantUserIndex}
        />
      )}
    </>
  );
}

export default function ParticipantUsersSection() {
  return (
    <ParticipantUsersModalContextProvider>
      <ParticipantUsersSectionContent />
    </ParticipantUsersModalContextProvider>
  );
}
