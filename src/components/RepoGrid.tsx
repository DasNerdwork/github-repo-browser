import { t } from "i18next";
import { RepoCard } from "./RepoCard";
import type { Repository } from ".././types";

interface RepoGridProps {
  repos: Repository[];
  loading?: boolean; // data still loading?
  hasSearched?: boolean; // user performed search?
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>; // used to hide filter dropdown on card animation
}

export const RepoGrid = ({ repos, loading, hasSearched, setIsDropdownOpen }: RepoGridProps) => {
  // only render if searched and data is loaded
  if (!hasSearched || loading) return null;

  // if no repos found, show message
  if (!repos.length) return <p className="text-center text-[var(--color-text)]/70">{t("noReposFound")}</p>;

  // render grid
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {repos.map((repo) => (
        <RepoCard
          key={repo.name}
          repo={repo}
          setIsDropdownOpen={setIsDropdownOpen}
        />
      ))}
    </div>
  );
};

