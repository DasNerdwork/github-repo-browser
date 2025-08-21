import { gql, useLazyQuery } from "@apollo/client";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Header, Intro, SearchBar, RepoGrid } from "./components";
import type { Repository, GitHubData } from "./types";

// GraphQL query to fetch a user's repositories with their top languages
export const GET_USER_REPOS = gql`
  query UserRepos($owner: String!) {
    user(login: $owner) {
      repositories(first: 100, orderBy: { field: UPDATED_AT, direction: DESC }) {
        nodes {
          name
          description
          url
          isPrivate
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            totalSize
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

export default function App() {
  const { t } = useTranslation();

  // State for user input
  const [username, setUsername] = useState("");
  const [owner, setOwner] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  // Lazy query to fetch repositories on demand
  const [getRepos, { data, loading, error }] = useLazyQuery<GitHubData>(GET_USER_REPOS);

   // State to track selected UI language
  const [currentLanguage, setCurrentLanguage] = useState<"de" | "en" | "es" | "fr">("en");

  // Called when user clicks search or presses Enter
  const handleSearch = () => {
    if (!username) return;
    setOwner(username);
    setHasSearched(true);
    getRepos({ variables: { owner: username } });
  };

  // Filter and sort repositories based on selected programming languages from dropdown
  const filteredRepos: Repository[] = useMemo(() => {
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
    return [...repos].sort((a, b) => (a.isPrivate === b.isPrivate ? 0 : a.isPrivate ? 1 : -1));
  }, [data, selectedLanguages]);

  // Compute all available programming languages and prioritize from dropdown selected ones
  const availableLanguages: string[] = useMemo(() => {
    if (!filteredRepos.length) return [];

    const freqMap: Record<string, number> = {};
    filteredRepos.forEach((repo: Repository) => {
      repo.languages.edges.forEach((edge) => {
        freqMap[edge.node.name] = (freqMap[edge.node.name] || 0) + 1;
      });
    });

    const allLangs = Object.keys(freqMap);
    const selected: string[] = selectedLanguages.filter(lang => allLangs.includes(lang));
    const notSelected: string[] = allLangs.filter(lang => !selected.includes(lang));

    // Sort unselected languages by frequency descending -> Dont sort selected ones
    notSelected.sort((a, b) => (freqMap[b] || 0) - (freqMap[a] || 0));

    return [...selected, ...notSelected];
  }, [filteredRepos, selectedLanguages]);

  return (
    <div className="min-h-screen w-full bg-[var(--color-base)] text-[var(--color-text)]">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header with ui language toggle */}
        <Header currentLanguage={currentLanguage} setCurrentLanguage={setCurrentLanguage} />

        {/* Intro text visible before search */}
        <Intro hasSearched={hasSearched} />

        {/* Search bar with programming language filter */}
        <SearchBar
          username={username}
          setUsername={setUsername}
          handleSearch={handleSearch}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          availableLanguages={availableLanguages}
          selectedLanguages={selectedLanguages}
          setSelectedLanguages={setSelectedLanguages}
          owner={owner}
          hasSearched={hasSearched}
        />

        {/* Loading and error feedback */}
        {loading && <p className="text-center text-[var(--color-text)]/70">{t("loading")}</p>}
        {error && <p className="text-center text-red-500">{t("error")}: {error.message}</p>}

        {/* Display filtered repositories */}
        <RepoGrid repos={filteredRepos} loading={loading} hasSearched={hasSearched} />
      </div>
    </div>
  );
}