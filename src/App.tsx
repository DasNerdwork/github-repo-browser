import { gql, useLazyQuery } from "@apollo/client";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Header, Intro, SearchBar, RepoGrid } from "./components";

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
  const [username, setUsername] = useState("");
  const [owner, setOwner] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [getRepos, { data, loading, error }] = useLazyQuery(GET_USER_REPOS);
  const [currentLanguage, setCurrentLanguage] = useState<"de" | "en" | "es" | "fr">("en");

  const handleSearch = () => {
    if (!username) return;
    setOwner(username);
    setHasSearched(true);
    getRepos({ variables: { owner: username } });
  };

  const filteredRepos = useMemo(() => {
    if (!data?.user?.repositories?.nodes) return [];
    let repos = data.user.repositories.nodes;

    // Sprachenfilter
    if (selectedLanguages.length > 0) {
      repos = repos.filter((repo: any) =>
        selectedLanguages.every((lang) =>
          repo.languages.edges.some((edge: any) => edge.node.name === lang)
        )
      );
    }

    // Public zuerst, Private danach
    return [...repos].sort((a, b) => {
      if (a.isPrivate === b.isPrivate) return 0;
      return a.isPrivate ? 1 : -1; // true (private) kommt nach false (public)
    });
  }, [data, selectedLanguages]);

  const availableLanguages = useMemo(() => {
    if (!filteredRepos.length) return [];

    const freqMap: Record<string, number> = {};
    filteredRepos.forEach((repo: any) => {
      repo.languages.edges.forEach((edge: any) => {
        freqMap[edge.node.name] = (freqMap[edge.node.name] || 0) + 1;
      });
    });

    const allLangs = Object.keys(freqMap);

    const selected: string[] = selectedLanguages.filter((lang) =>
      allLangs.includes(lang)
    );

    const notSelected: string[] = allLangs.filter((lang) => !selected.includes(lang));
    notSelected.sort((a, b) => (freqMap[b] || 0) - (freqMap[a] || 0));

    return [...selected, ...notSelected];
  }, [filteredRepos, selectedLanguages]);

  return (
    <div className="min-h-screen w-full bg-[var(--color-base)] text-[var(--color-text)]">
      <div className="max-w-6xl mx-auto p-6">
        <Header currentLanguage={currentLanguage} setCurrentLanguage={setCurrentLanguage} />
        <Intro hasSearched={hasSearched} />
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

        {loading && <p className="text-center text-[var(--color-text)]/70">{t("loading")}</p>}
        {error && <p className="text-center text-red-500">{t("error")}: {error.message}</p>}

        <RepoGrid repos={filteredRepos} loading={loading} hasSearched={hasSearched} />
      </div>
    </div>
  );
}