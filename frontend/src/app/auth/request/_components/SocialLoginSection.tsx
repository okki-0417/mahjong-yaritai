import GoogleLoginButton from "@/src/app/auth/request/_components/GoogleLoginButton";
import LineLoginButton from "@/src/app/auth/request/_components/LineLoginButton";
import Link from "next/link";

export default function SocialLoginSection() {
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
