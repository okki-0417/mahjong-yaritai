"use client";

import FetchRepliesButton from "@/src/components/CommentCard/ParentCommentCard/FetchRepliesButton";
import { Comment } from "@/src/generated/graphql";
import {
  Box,
  Button,
  Circle,
  Divider,
  HStack,
  Img,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { MdKeyboardArrowUp, MdOutlineReply } from "react-icons/md";
import useGetSession from "@/src/hooks/useGetSession";
import UserModal from "@/src/components/Modals/UserModal";
import NotLoggedInModal from "@/src/components/Modals/NotLoggedInModal";
import ChildCommentCard from "@/src/components/CommentCard/ChildCommentCard";
import { FaRegComment } from "react-icons/fa6";

type Props = {
  comment: Comment;
  /* eslint-disable-next-line no-unused-vars */
  onReply: (comment: Comment) => void;
  commentableType: string;
  commentableId: string;
};

export default function ParentCommentCard({
  comment,
  onReply,
  commentableType,
  commentableId,
}: Props) {
  const [replies, setReplies] = useState<Comment[]>([]);
  const [isRepliesVisible, setIsRepliesVisible] = useState(false);
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

  const onRepliesFetched = (fetchedReplies: Comment[]) => {
    setReplies(fetchedReplies);
    setIsRepliesVisible(true);
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

        <HStack justifyContent="space-between" align="end" mt="1">
          <Text fontFamily="sans-serif" fontSize="xs" className="text-secondary" flexShrink={0}>
            {new Date(comment.createdAt).toLocaleString()}
          </Text>

          <HStack w="full" justifyContent="end" alignItems="center" mt="1">
            {comment.repliesCount > 0 && !isRepliesVisible ? (
              <FetchRepliesButton
                parentComment={comment}
                commentableType={commentableType}
                commentableId={commentableId}
                onRepliesFetched={onRepliesFetched}
              />
            ) : (
              <HStack gap="1" mx="1">
                <FaRegComment size={20} color="gray" />
                <Text fontSize="md" fontWeight="semibold" fontFamily="sans-serif" color="gray">
                  {comment.repliesCount}
                </Text>
              </HStack>
            )}
          </HStack>
        </HStack>
      </Box>

      {isRepliesVisible && (
        <Box w="full" mt="4">
          <VStack pl="8" divider={<Divider />} alignItems="stretch">
            {replies.map((reply: Comment) => (
              <ChildCommentCard
                key={reply.id}
                reply={reply}
                commentableType={commentableType}
                commentableId={commentableId}
                onReply={onReply}
              />
            ))}
          </VStack>
          <HStack justifyContent="end" w="full" mt="2">
            <Button
              px="2"
              py="1"
              size="sm"
              fontSize="xs"
              onClick={() => setIsRepliesVisible(false)}
              variant="ghost">
              <MdKeyboardArrowUp size={20} />
              <Text className="text-secondary">スレッドを閉じる</Text>
            </Button>
          </HStack>
        </Box>
      )}

      <NotLoggedInModal isOpen={isNotLoggedInModalOpen} onClose={onNotLoggedInModalClose} />
      <UserModal user={comment.user} isOpen={isUserModalOpen} onClose={onUserModalClose} />
    </>
  );
}
