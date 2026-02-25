"use client";

import useToast from "@/src/hooks/useToast";
import { apiClient } from "@/src/lib/api/client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LineLoginButton() {
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
    <button
      onClick={handleLineLogin}
      className="rounded-full w-64 bg-white py-2 px-4 flex items-center gap-4 hover:bg-gray-200"
    >
      <div className="flex items-center w-full">
        <div className="size-8 flex items-center rounded-full">
          <Image src="/social-login/line.png" alt="" width="160" height="160" />
        </div>
        <p className="w-full text-primary">LINEでログイン/登録</p>
      </div>
    </button>
  );
}
