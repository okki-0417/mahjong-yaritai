"use client";

import UserListItem from "@/src/components/Modals/FollowStatsModal/FollowStatsItem";
import { User } from "@/src/generated/graphql";
import { Text, VStack } from "@chakra-ui/react";

type Props = {
  users: User[];
};

export default function FollowStatsList({ users }: Props) {
  return (
    <VStack spacing="2" align="stretch" divider={<hr />} color="secondary.500">
      {users.length > 0 ? (
        users.map(user => <UserListItem key={user.id} user={user} />)
      ) : (
        <VStack py={4} align="center">
          <Text fontStyle="italic" fontSize="sm">
            まだ誰もいません
          </Text>
        </VStack>
      )}
    </VStack>
  );
}
