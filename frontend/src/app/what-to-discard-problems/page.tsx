import { Suspense } from "react";
import { Metadata } from "next";
import ProblemsSection from "@/src/app/what-to-discard-problems/_components/ProblemSection";

export const metadata: Metadata = {
  title: "何切る問題集",
  description:
    "様々な麻雀の状況での最適な選択を考えながら、他のプレイヤーと意見を交換できます。麻雀の判断力を磨き、より良い打牌選択を身につけましょう。",
  openGraph: {
    title: "何切る問題集 | 麻雀ヤリタイ",
    description:
      "様々な状況での最適な選択を考え、他のプレイヤーと意見交換。麻雀の判断力を磨きましょう。",
  },
};

export default function WhatToDiscardProblems() {
  return (
    <div className="w-7xl mx-auto lg:px-6 px-px lg:mt-12 mt-6">
      <Suspense fallback={<div>読み込み中...</div>}>
        <ProblemsSection />
      </Suspense>
    </div>
  );
}
