import { useMemo } from "react";
import type { Repository, GitHubData } from "../types";

// Filter and sort repositories based on selected programming languages from dropdown
export function useFilteredRepos(data: GitHubData | undefined, selectedLanguages: string[]) {
  return useMemo<Repository[]>(() => {
    if (!data?.user?.repositories?.nodes) return [];
    let repos: Repository[] = data.user.repositories.nodes;

    // ALL selections have to match
    if (selectedLanguages.length > 0) {
      repos = repos.filter(repo =>
        selectedLanguages.every(lang =>
          repo.languages.edges.some(edge => edge.node.name === lang)
        )
      );
    }

    // Sort: public first, private last
    return [...repos].sort((a, b) =>
      a.isPrivate === b.isPrivate ? 0 : a.isPrivate ? 1 : -1
    );
  }, [data, selectedLanguages]);
}
