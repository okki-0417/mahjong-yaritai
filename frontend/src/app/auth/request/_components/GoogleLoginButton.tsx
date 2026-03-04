import Image from "next/image";
import Link from "next/link";

export default function GoogleLoginButton() {
  const googleLoginUrl = process.env.NEXT_PUBLIC_GOOGLE_LOGIN_URL;

  if (!googleLoginUrl) {
    return null;
  }

  return (
    <Link
      href={googleLoginUrl}
      className="rounded-sm w-64 bg-white py-2 px-4 flex items-center gap-4 hover:bg-gray-200"
    >
      <div className="flex items-center gap-4">
        <div className="size-8 flex items-center">
          <Image
            src="/social-login/google.png"
            alt="Googleでログイン/登録"
            width="160"
            height="160"
          />
        </div>
        <p className="text-primary">Googleでログイン/登録</p>
      </div>
    </Link>
  );
}
