import { cn } from "@/src/lib/cn";

export type HighlightPart = {
  text: string;
  match: boolean;
};

export function getHighlightParts(text: string, query: string): HighlightPart[] {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [{ text, match: false }];
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = normalizedQuery.toLowerCase();
  const parts: HighlightPart[] = [];
  let start = 0;
  let index = lowerText.indexOf(lowerQuery, start);

  while (index !== -1) {
    if (index > start) {
      parts.push({ text: text.slice(start, index), match: false });
    }

    parts.push({
      text: text.slice(index, index + normalizedQuery.length),
      match: true,
    });

    start = index + normalizedQuery.length;
    index = lowerText.indexOf(lowerQuery, start);
  }

  if (start < text.length) {
    parts.push({ text: text.slice(start), match: false });
  }

  return parts.length > 0 ? parts : [{ text, match: false }];
}

type HighlightedLabelProps = {
  label: string;
  query: string;
  className?: string;
  matchClassName?: string;
};

export function HighlightedLabel({
  label,
  query,
  className,
  matchClassName = "rounded-sm bg-primary-light font-semibold text-primary",
}: HighlightedLabelProps) {
  const parts = getHighlightParts(label, query);

  return (
    <span className={cn("text-text", className)}>
      {parts.map((part, index) =>
        part.match ? (
          <mark
            key={`${part.text}-${index}`}
            className={cn(
              "bg-transparent p-0",
              matchClassName,
            )}
          >
            {part.text}
          </mark>
        ) : (
          <span key={`${part.text}-${index}`}>{part.text}</span>
        ),
      )}
    </span>
  );
}
