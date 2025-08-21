import { t } from "i18next";
import { RepoCard } from "./RepoCard";

interface RepoGridProps {
  repos: any[];
  loading?: boolean;
  hasSearched?: boolean;
}

export const RepoGrid = ({ repos, loading, hasSearched }: RepoGridProps) => {
  if (!hasSearched || loading) return null;
  if (!repos.length) return <p className="text-center text-[var(--color-text)]/70">{t("noReposFound")}</p>;
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {repos.map((repo) => (
        <RepoCard key={repo.name} repo={repo} />
      ))}
    </div>
  );
};

