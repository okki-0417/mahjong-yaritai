"use client";

import Link from "next/link";
import ButtonAccent from "@/src/components/Buttons/ButtonAccent";
import Modal from "@/src/components/Modal";

export default function NotLoggedInModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <p>未ログイン</p>

      <div className="mt-2">
        <p>この機能はログインしている時のみ利用できます。</p>

        <div className="mt-4">
          <Link href="/auth/request">
            <button className="px-4 py-2 bg-pink-500 text-neutral rounded-sm hover:bg-pink-600">
              認証
            </button>
          </Link>
        </div>
      </div>
    </Modal>
  );
}
