"use client";

import createLineLoginUrlAction from "@/src/actions/createLineLoginUrlAction";
import useToast from "@/src/hooks/useToast";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LineLoginButton() {
  const router = useRouter();
  const toast = useToast();

  const handleLineLogin = async () => {
    const result = await createLineLoginUrlAction();

    if (result.errors) {
      toast({
        title: "LINEのログインURLの取得に失敗しました",
        description: result.errors.join("\n"),
        status: "error",
      });
      return;
    }

    if (result.data?.login_url) {
      router.push(result.data.login_url);
    }
  };

  return (
    <button
      onClick={handleLineLogin}
      className="rounded-sm w-64 bg-white py-2 px-4 flex items-center gap-4 hover:bg-gray-200"
    >
      <div className="flex gap-4 items-center">
        <div className="w-10 flex items-center">
          <Image
            src="/social-login/line.png"
            alt="LINEでログイン/登録"
            width="160"
            height="160"
          />
        </div>
        <p className="w-full text-primary">LINEでログイン/登録</p>
      </div>
    </button>
  );
}
