import ProfileEdit from "@/src/app/me/_components/DashboardSection/ProfileEdit";
import Logout from "@/src/app/me/_components/DashboardSection/Logout";
import FollowStatsSection from "@/src/app/me/_components/DashboardSection/FollowStats";
import Link from "next/link";
import fetchDashboardDataService from "@/src/app/me/_services/fetchDashboardDataService";
import ErrorPage from "@/src/components/errors/ErrorPage";

export default async function DashboardSection() {
  try {
    const [user, followStats] = await fetchDashboardDataService();

    return (
      <div>
        <div className="flex justify-end gap-1">
          <ProfileEdit />
          <Logout />
        </div>

        <div className="flex justify-between">
          <div className="flex lg:flex-row lg:items-start items-center flex-col w-full gap-4">
            <div className="shrink-0 lg:size-48 size-36 bg-white overflow-hidden rounded-full flex justify-center items-center border-2 border-slate-300">
              <div
                style={{
                  backgroundImage: `url(${user.avatar_url || "/no-image.webp"})`,
                }}
                className="w-full h-full bg-cover bg-center"
              />
            </div>

            <div>
              <p className="text-3xl font-bold">{user.name}</p>
              <p className="mt-2 text-sm line-clamp-4">
                {user.profile_text
                  ? user.profile_text
                  : "自己紹介文が未設定です。"}
              </p>
              <div className="mt-4 flex justify-start">
                <FollowStatsSection
                  userId={user.id}
                  followingCount={followStats.following_count}
                  followersCount={followStats.followers_count}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-10 gap-1">
          <Link
            href="/me/what-to-discard-problems/voted"
            className="inline-block hover:bg-secondary-light p-4 rounded-sm border"
          >
            <span>投票した何切る問題</span>
          </Link>

          <Link
            href="/me/participated-mahjong-sessions"
            className="inline-block hover:bg-secondary-light p-4 rounded-sm border"
          >
            <span>麻雀戦績</span>
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    console.error("DashboardSection error:", error);

    return (
      <ErrorPage
        message={
          error instanceof Error
            ? error.message
            : "ダッシュボードのデータの取得に失敗しました。"
        }
      />
    );
  }
}
