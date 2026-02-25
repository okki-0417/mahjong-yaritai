import { Suspense } from "react";
import AuthRequestSection from "@/src/app/auth/request/_components/AuthRequestSection";

export default function AuthRequest() {
  return (
    <div className="lg:w-xl mx-auto mt-10">
      <h1 className="text-3xl">認証リクエスト</h1>
      <hr />
      <div className="mt-8 gap-6 w-full flex flex-col">
        <Suspense fallback={<p>読み込み中...</p>}>
          <AuthRequestSection />
        </Suspense>
      </div>
    </div>
  );
}
