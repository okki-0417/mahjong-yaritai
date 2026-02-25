"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  requestAction,
  type RequestActionFormInput,
} from "@/src/actions/requestAction";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const authRequestSchema = z.object({
  email: z
    .string()
    .email("有効なメールアドレスを入力してください")
    .max(255, "メールアドレスは255文字以内で入力してください"),
});

export default function AuthRequestForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RequestActionFormInput>({
    resolver: zodResolver(authRequestSchema),
  });

  const onSubmit: SubmitHandler<RequestActionFormInput> = async (
    formData: RequestActionFormInput,
  ) => {
    const result = await requestAction(formData);

    if (result.errors) {
      setError("email", {
        type: "manual",
        message: result.errors?.join(", ") || "サーバーエラーが発生しました",
      });
      return;
    }
    router.push("/auth/verification");
  };

  return (
    <div>
      <h1 className="text-lg w-full">メールアドレスでログイン/登録</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-2">
        <div className="flex flex-col items-start space-y-4">
          <div className="w-full">
            <input
              type="email"
              placeholder="test@mahjong-yaritai.com"
              autoComplete="email"
              className="w-full p-2 border border-white rounded-sm"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <p className="text-sm">
            <Link
              href="/terms"
              className="text-blue-200 underline"
              target="_blank"
            >
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-pink-500 text-white rounded"
          >
            {isSubmitting ? "送信中..." : "送信する"}
          </button>
        </div>
      </form>
    </div>
  );
}
