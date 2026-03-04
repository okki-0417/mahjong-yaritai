import { Metadata } from "next";
import privacyData from "./privacy-data.json";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description:
    "麻雀ヤリタイのプライバシーポリシー・個人情報の取扱いに関する基本方針をご確認いただけます。",
  openGraph: {
    title: "麻雀ヤリタイ - プライバシーポリシー",
    description:
      "麻雀ヤリタイのプライバシーポリシー・個人情報の取扱いに関する基本方針",
  },
};

type ListSectionProps = {
  title: string;
  description?: string | string[];
  items?: string[];
};

function ListSection({ title, description, items }: ListSectionProps) {
  return (
    <div>
      <h2 className="lg:text-xl text-lg font-bold">{title}</h2>

      {description && (
        <div className="mt-3 flex flex-col items-stretch gap-2">
          {Array.isArray(description) ? (
            description.map((desc, index) => <p key={index}>{desc}</p>)
          ) : (
            <p>{description}</p>
          )}
        </div>
      )}

      {items && (
        <ol className="mt-3 list-disc space-y-2 pl-4">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <div className="mt-12 max-w-4xl mx-auto">
      <h1 className="lg:text-4xl text-2xl font-bold">プライバシーポリシー</h1>

      <div className="mt-8 text-sm lg:text-md flex flex-col items-stretch gap-8">
        {privacyData.sections.map((section, index) => (
          <div key={index}>
            <ListSection
              title={section.title}
              description={section.description}
              items={section.items}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
