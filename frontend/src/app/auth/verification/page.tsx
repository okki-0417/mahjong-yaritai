import { Suspense } from "react";
import AuthVerificationSection from "@/src/app/auth/verification/_components/AuthVerificationSection";

export default function AuthVerification() {
  return (
    <div className="lg:w-xl mx-auto mt-10">
      <h1 className="text-2xl lg:text-2xl">認証メールを送信しました</h1>

      <p className="mt-6">メール内の認証コードを入力してください</p>

      <div className="mt-1">
        <Suspense fallback={<p>読み込み中...</p>}>
          <AuthVerificationSection />
        </Suspense>
      </div>
    </div>
  );
}
