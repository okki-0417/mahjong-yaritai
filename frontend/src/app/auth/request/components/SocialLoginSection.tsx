"use client";

import SocialLoginButton from "@/src/app/auth/request/components/SocialLoginButton";
import { apiClient } from "@/src/lib/api/client";
import { ListItem, Text, UnorderedList, useToast, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SocialLoginSection() {
  const router = useRouter();
  const toast = useToast();

  const handleGoogleLogin = () => router.push(process.env.NEXT_PUBLIC_GOOGLE_LOGIN_URL);

  const handleLineLogin = async () => {
    try {
      const response = await apiClient.getLineLoginUrl();
      if (!response.login_url) throw new Error();

      router.push(response.login_url);
    } catch (error) {
      toast({
        title: "LINEのログインURLの取得に失敗しました",
        description: error.message,
        status: "error",
      });
    }
  };

  return (
    <VStack w="full" align="stretch" spacing="2">
      <Text fontSize="lg" fontWeight="bold" w="full">
        持っているアカウントでログイン/登録
      </Text>

      <Text fontSize="sm">
        <Link href="/terms" className="text-blue-200 underline" target="_blank">
          利用規約
        </Link>
        と
        <Link href="/privacy" className="text-blue-200 underline" target="_blank">
          プライバシーポリシー
        </Link>
        に同意の上、ログイン/登録を行ってください。
      </Text>

      <UnorderedList>
        <VStack gap="2" mt="2">
          <ListItem listStyleType="none">
            <SocialLoginButton
              handler={handleGoogleLogin}
              label="Googleでログイン/登録"
              iconSrc="/social-login/google.png"
            />
          </ListItem>

          <ListItem listStyleType="none">
            <SocialLoginButton
              handler={handleLineLogin}
              label="LINEでログイン/登録"
              iconSrc="/social-login/line.png"
            />
          </ListItem>
        </VStack>
      </UnorderedList>
    </VStack>
  );
}
