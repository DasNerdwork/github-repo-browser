import { useMemo } from "react";
import type { Repository } from "../types";

// Compute all available programming languages and prioritize from dropdown selected ones
export function useAvailableLanguages(filteredRepos: Repository[], selectedLanguages: string[]) {
  return useMemo<string[]>(() => {
    if (!filteredRepos.length) return [];

    const freqMap: Record<string, number> = {};
    filteredRepos.forEach((repo: Repository) => {
      repo.languages.edges.forEach(edge => {
        freqMap[edge.node.name] = (freqMap[edge.node.name] || 0) + 1;
      });
    });

    const allLangs = Object.keys(freqMap);
    const selected = selectedLanguages.filter(lang => allLangs.includes(lang));
    const notSelected = allLangs.filter(lang => !selected.includes(lang));

    // Sort unselected languages by frequency
    notSelected.sort((a, b) => (freqMap[b] || 0) - (freqMap[a] || 0));

    return [...selected, ...notSelected];
  }, [filteredRepos, selectedLanguages]);
}
