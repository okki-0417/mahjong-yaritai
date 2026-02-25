import { Box, Button, Circle, Image, Text, VStack } from "@chakra-ui/react";
import { CiEdit } from "react-icons/ci";
import FollowButton from "@/src/components/FollowButton";
import FollowStats from "@/src/app/me/_components/DashboardSection/FollowStats";
import { User } from "@/src/generated/graphql";
import Link from "next/link";

type Props = {
  user: User;
  isMyProfile?: boolean;
};

export default function UserProfile({ user, isMyProfile = false }: Props) {
  if (!user) return <Box>ユーザーが見つかりません。</Box>;

  return (
    <VStack gap="4" align="stretch">
      {isMyProfile && (
        <Link href="/me/profile/edit">
          <Button>
            <CiEdit size={20} />
          </Button>
        </Link>
      )}

      <VStack spacing={4}>
        <Circle size={["150", "200"]} overflow="hidden">
          <Image
            src={user.avatarUrl || "/no-image.webp"}
            alt={user.name}
            w="full"
            h="full"
            objectFit="cover"
          />
        </Circle>

        <Box textAlign="center" maxW="md" mx="auto">
          <Text fontSize={["2xl", "4xl"]} wordBreak="break-word">
            {user.name}
          </Text>
        </Box>

        <FollowStats
          userId={parseInt(user.id, 10)}
          followersCount={user.followersCount ?? 0}
          followingCount={user.followingCount ?? 0}
        />

        {isMyProfile == false && (
          <FollowButton
            userId={user.id}
            initialIsFollowing={user.isFollowing}
          />
        )}

        <Text
          fontSize={["md", "lg"]}
          whiteSpace="pre-wrap"
          wordBreak="break-word"
        >
          {user.profileText}
        </Text>
      </VStack>
    </VStack>
  );
}
