"use client";

import { Comment } from "@/src/generated/graphql";
import { Box, Button, Circle, HStack, Img, Text, useDisclosure } from "@chakra-ui/react";
import { MdOutlineReply } from "react-icons/md";
import useGetSession from "@/src/hooks/useGetSession";
import UserModal from "@/src/components/Modals/UserModal";
import NotLoggedInModal from "@/src/components/Modals/NotLoggedInModal";

type Props = {
  comment: Comment;
  /* eslint-disable-next-line no-unused-vars */
  onReply: (comment: Comment) => void;
};

export default function CommentCard({ comment, onReply }: Props) {
  const { session } = useGetSession();
  const isLoggedIn = session?.isLoggedIn;

  const {
    isOpen: isUserModalOpen,
    onOpen: onUserModalOpen,
    onClose: onUserModalClose,
  } = useDisclosure();

  const {
    isOpen: isNotLoggedInModalOpen,
    onOpen: onNotLoggedInModalOpen,
    onClose: onNotLoggedInModalClose,
  } = useDisclosure();

  const handleReplyClick = () => {
    if (!isLoggedIn) {
      onNotLoggedInModalOpen();
      return;
    }
    onReply(comment);
  };

  return (
    <>
      <Box w="full">
        <HStack alignItems="center" justifyContent="space-between">
          <Button colorScheme="" onClick={onUserModalOpen} p="0">
            <HStack>
              <Circle size="8" overflow="hidden" border="1px" borderColor="gray.300">
                <Img
                  src={comment.user.avatarUrl || "/no-image.webp"}
                  className="w-full h-full object-cover"
                />
              </Circle>
              <Text fontWeight="bold" className="text-primary">
                {comment.user.name}
              </Text>
            </HStack>
          </Button>

          <Button size="sm" px="1" onClick={handleReplyClick} bgColor="inherit">
            <MdOutlineReply size={18} className="text-primary" />
          </Button>
        </HStack>

        <Text mt="1">{comment.content}</Text>

        <HStack justifyContent="end" mt="1">
          <Text fontFamily="sans-serif" fontSize="xs" className="text-secondary">
            {new Date(comment.createdAt).toLocaleString()}
          </Text>
        </HStack>
      </Box>

      <NotLoggedInModal isOpen={isNotLoggedInModalOpen} onClose={onNotLoggedInModalClose} />
      <UserModal user={comment.user} isOpen={isUserModalOpen} onClose={onUserModalClose} />
    </>
  );
}
