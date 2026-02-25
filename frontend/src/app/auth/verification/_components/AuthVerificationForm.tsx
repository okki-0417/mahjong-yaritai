"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  verifyAction,
  type VerifyActionFormData,
} from "@/src/actions/verifyAction";
import useToast from "@/src/hooks/useToast";

export default function AuthVerificationForm() {
  const router = useRouter();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<VerifyActionFormData>();

  const onSubmit: SubmitHandler<VerifyActionFormData> = async (
    formData: VerifyActionFormData,
  ) => {
    const result = await verifyAction(formData);

    if (result.errors) {
      setError("token", { type: "server", message: result.errors.join(", ") });
      return;
    }

    if (result.data.user_name) {
      router.push("/me");
      toast({ title: "認証に成功しました", status: "success" });
    } else {
      toast({ title: "ユーザー登録が必要です", status: "info" });
      router.push("/users/new");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-start gap-4">
        <div className="w-full">
          <input
            type="text"
            className="w-full rounded-sm border border-white p-2 tracking-widest"
            placeholder="認証コード（例：123456）"
            {...register("token", { required: "認証コードは必須です" })}
          />
          {errors.token && (
            <p className="text-red-500 mt-1">{errors.token.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-pink-500 text-white py-2 px-4 rounded-sm"
        >
          {isSubmitting ? "認証中..." : "認証する"}
        </button>
      </div>
    </form>
  );
}
