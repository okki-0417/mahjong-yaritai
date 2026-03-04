import { Metadata } from "next";
import termsData from "@/src/app/terms/_data/terms-data.json";
import Section from "@/src/app/terms/_components/Section";

export const metadata: Metadata = {
  title: "利用規約",
  description:
    "麻雀ヤリタイの利用規約をご確認いただけます。本サービスをご利用いただく前に必ずお読みください。",
  openGraph: {
    title: "麻雀ヤリタイ - 利用規約",
    description: "麻雀ヤリタイの利用規約",
  },
};

export default function TermsPage() {
  return (
    <div className="mt-12 max-w-4xl mx-auto">
      <h1 className="text-2xl lg:text-4xl font-bold">利用規約</h1>

      <div className="mt-8 lg:text-md text-sm flex flex-col items-stretch gap-10">
        {termsData.sections.map((section, index) => (
          <Section
            key={index}
            title={section.title}
            description={section.description}
            subsections={section.subsections}
          />
        ))}
      </div>
    </div>
  );
}
