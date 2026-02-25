import { Suspense } from "react";
import DashboardSection from "@/src/app/me/_components/DashboardSection";

export default function Dashboard() {
  return (
    <div className="lg:w-2xl w-full lg:px-0 px-2 mt-8 mx-auto">
      <Suspense fallback={<div>読み込み中...</div>}>
        <DashboardSection />
      </Suspense>
    </div>
  );
}
