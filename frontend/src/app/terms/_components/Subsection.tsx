interface SubsectionProps {
  title: string;
  description?: string | string[];
  items?: string[];
}

export function Subsection({ title, description, items }: SubsectionProps) {
  return (
    <div>
      <h3 className="text-md lg:text-lg">{title}</h3>

      {description && (
        <div className="mt-2 flex flex-col items-stretch">
          {Array.isArray(description) ? (
            description.map((desc, index) => <p key={index}>{desc}</p>)
          ) : (
            <p>{description}</p>
          )}
        </div>
      )}

      {items && (
        <ol className="mt-2 list-disc pl-4 gap-1 flex flex-col items-stretch">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      )}
    </div>
  );
}
