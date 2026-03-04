import { Subsection } from "./Subsection";

interface SubsectionData {
  title: string;
  description?: string | string[];
  items?: string[];
}

interface SectionProps {
  title: string;
  description?: string | string[];
  subsections?: SubsectionData[];
}

export default function Section({
  title,
  description,
  subsections,
}: SectionProps) {
  return (
    <div>
      <h2 className="text-lg lg:text-2xl">{title}</h2>

      {description && (
        <div className="mt-2 flex flex-col items-stretch">
          {Array.isArray(description) ? (
            description.map((desc, index) => <p key={index}>{desc}</p>)
          ) : (
            <p>{description}</p>
          )}
        </div>
      )}

      {subsections && (
        <div className="mt-2 flex flex-col items-stretch gap-4">
          {subsections.map((subsection, index) => (
            <Subsection
              key={index}
              title={subsection.title}
              description={subsection.description}
              items={subsection.items}
            />
          ))}
        </div>
      )}
    </div>
  );
}
