import { Lock } from "lucide-react";

interface LanguageSummary {
  name: string;
  color: string | null;
  percent: string | number;
}

interface RepoCardProps {
  repo: {
    name: string;
    description: string | null;
    url: string;
    isPrivate: boolean;
    languages: {
      totalSize: number;
      edges: { size: number; node: { name: string; color: string | null } }[];
    };
  };
}

export const RepoCard = ({ repo }: RepoCardProps) => {
  const totalSize = repo.languages.totalSize || 1;
  const sortedEdges = [...repo.languages.edges].sort((a, b) => b.size - a.size);

  const maxVisible = 5;
  const summary: { name: string; color: string | null; size: number }[] = [];
  let otherSize = 0;

  sortedEdges.forEach((edge, index) => {
    if (index < maxVisible) summary.push({ name: edge.node.name, color: edge.node.color, size: edge.size });
    else otherSize += edge.size;
  });

  if (otherSize > 0) summary.push({ name: "Other", color: "#6b7280", size: otherSize });

  const summaryWithPercent: LanguageSummary[] = summary.map((lang) => {
    const percent = (lang.size / totalSize) * 100;
    return { ...lang, percent: percent < 0.1 ? "<0.1" : percent.toFixed(1) };
  });

  const Wrapper = repo.isPrivate ? "div" : "a";

  return (
    <Wrapper
      key={repo.name}
      {...(!repo.isPrivate && {
        href: repo.url,
        target: "_blank",
        rel: "noopener noreferrer",
      })}
      title={repo.isPrivate ? "Private Repository" : undefined}
      className={`block bg-[var(--color-card)] rounded-lg shadow-lg px-4 pb-4
        transition-transform min-h-[240px]
        ${repo.isPrivate
          ? "cursor-not-allowed select-none bg-[var(--color-card)]/60"
          : "hover:shadow-2xl hover:scale-105 transform transition-all duration-300"
        }`}
    >
      {/* Titelzeile */}
      <div className="flex justify-between items-stretch">
        <h3 className="text-xl py-2 font-semibold text-[var(--color-text)] flex-1">{repo.name}</h3>
        {repo.isPrivate && (
          <div className="flex items-center gap-4">
            <div className="w-px bg-[var(--color-base)] h-full" />
            <Lock size={20} strokeWidth={2.5} className="text-[var(--color-text)]/90" aria-label="Private repository" />
          </div>
        )}
      </div>

      {/* Schwarze Linie */}
      <div className="-mx-6 mb-2 h-px bg-[var(--color-base)]" />

      {/* Beschreibung */}
      <p className="text-sm text-[var(--color-text)]/80 mb-3 line-clamp-2 min-h-[2.5rem]">
        {repo.description || "This project has no description."}
      </p>

      {/* Language bar */}
      <div className="flex h-4 w-full rounded overflow-hidden mb-3 bg-[var(--color-base)]/20">
        {summaryWithPercent.map((lang) => (
          <div
            key={lang.name}
            className="h-full"
            style={{ width: `${lang.percent}%`, backgroundColor: lang.color || "#6b7280" }}
            title={`${lang.name}: ${lang.percent}%`}
          />
        ))}
      </div>

      {/* Language list */}
      <ul className="grid grid-cols-2 gap-y-2 text-sm text-[var(--color-text)]/90">
        {summaryWithPercent.map((lang) => (
          <li key={lang.name} className="flex items-center">
            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: lang.color || "#6b7280" }} />
            <span>{lang.name}</span>
            <span className="ml-1 text-[var(--color-text)]/60">{lang.percent}%</span>
          </li>
        ))}
      </ul>
    </Wrapper>
  );
};
