"use client";

import GoogleLoginButton from "@/src/app/auth/request/_components/GoogleLoginButton";
import LineLoginButton from "@/src/app/auth/request/_components/LineLoginButton";
import useToast from "@/src/hooks/useToast";
import { apiClient } from "@/src/lib/api/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SocialLoginSection() {
  const router = useRouter();
  const toast = useToast();

  const handleLineLogin = async () => {
    try {
      const response = await apiClient.getLineLoginUrl();
      if (!response.login_url) throw new Error();

      router.push(response.login_url);
    } catch (error) {
      toast({
        title: "LINEのログインURLの取得に失敗しました",
        description:
          error instanceof Error ? error.message : "不明なエラーが発生しました",
        status: "error",
      });
    }
  };

  return (
    <div className="w-full flex flex-col items-stretch gap-2">
      <h1 className="text-lg w-full">持っているアカウントでログイン/登録</h1>

      <p className="text-sm">
        <Link href="/terms" className="text-blue-200 underline" target="_blank">
          利用規約
        </Link>
        と
        <Link
          href="/privacy"
          className="text-blue-200 underline"
          target="_blank"
        >
          プライバシーポリシー
        </Link>
        に同意の上、ログイン/登録を行ってください。
      </p>

      <ul className="w-full">
        <div className="flex flex-col items-center gap-2 mt-2">
          <li className="list-none">
            <GoogleLoginButton />
          </li>

          <li className="list-none">
            <LineLoginButton />
          </li>
        </div>
      </ul>
    </div>
  );
}
