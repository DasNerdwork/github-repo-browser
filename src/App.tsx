import { useLazyQuery } from "@apollo/client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Header, Intro, SearchBar, RepoGrid } from "./components";
import type { GitHubData } from "./types";
import { useFilteredRepos, useAvailableLanguages } from "./hooks";
import { GET_USER_REPOS } from "./apollo/queries/repos";

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
  const filteredRepos = useFilteredRepos(data, selectedLanguages);

  // Compute all available programming languages and prioritize from dropdown selected ones
  const availableLanguages = useAvailableLanguages(filteredRepos, selectedLanguages);

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