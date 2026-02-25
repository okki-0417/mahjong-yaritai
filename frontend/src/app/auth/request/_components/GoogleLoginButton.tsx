"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function GoogleLoginButton() {
  const router = useRouter();
  const handleGoogleLogin = () => {
    const googleLoginUrl = process.env.NEXT_PUBLIC_GOOGLE_LOGIN_URL;
    if (googleLoginUrl) router.push(googleLoginUrl);
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="rounded-full w-64 bg-white py-2 px-4 flex items-center gap-4 hover:bg-gray-200"
    >
      <div className="flex items-center w-full">
        <div className="size-8 flex items-center rounded-full">
          <Image
            src="/social-login/google.png"
            alt=""
            width="160"
            height="160"
          />
        </div>
        <p className="w-full text-primary">Googleでログイン/登録</p>
      </div>
    </button>
  );
}
