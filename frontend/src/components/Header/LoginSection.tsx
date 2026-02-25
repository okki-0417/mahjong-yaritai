import Link from "next/link";

export default function LoginSection({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div>
      {!isLoggedIn && (
        <li>
          <Link href="/auth/request">
            <div className="flex items-center gap-1">
              <button className="py-2 px-4 rounded-sm hover:bg-secondary">
                ログイン / 新規登録
              </button>
            </div>
          </Link>
        </li>
      )}
    </div>
  );
}
