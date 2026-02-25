"use client";

import { logoutAction } from "@/src/actions/logoutAction";
import useToast from "@/src/hooks/useToast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GrLogout } from "react-icons/gr";

export default function Logout() {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (!confirm("ログアウトしますか？")) return;

    setIsLoading(true);

    try {
      const result = await logoutAction();

      if (result.errors) {
        toast({
          title: "ログアウトに失敗しました",
          description: result.errors[0],
          status: "error",
        });
        return;
      }

      toast({ title: "ログアウトしました", status: "success" });
      router.push("/");
    } catch {
      toast({
        title: "ログアウトに失敗しました",
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="p-2 rounded-sm hover:bg-secondary-light border disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <GrLogout size={20} color="white" />
    </button>
  );
}
