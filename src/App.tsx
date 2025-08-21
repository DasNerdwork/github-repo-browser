import { gql, useLazyQuery } from "@apollo/client";
import { useState, useMemo } from "react";
import { ThemeToggle, LanguageSelector } from "./components";
import { Lock, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

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
        {/* Header mit ThemeToggle */}
        <div className="flex justify-between items-center mb-8 gap-2">
          <h1
            className="text-2xl font-bold text-[var(--color-text)]"
          >
            <a href="/" className="cursor-pointer"> 
              {t("projectTitle")}
            </a>
          </h1>

          <div className="flex items-center gap-2">
            <LanguageSelector current={currentLanguage} onChange={setCurrentLanguage} />
            <ThemeToggle />
          </div>
        </div>

      {/* Wrapper für Intro + Suche */}
      <div
        className={`w-full flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${hasSearched ? "translate-y-0" : "translate-y-[25vh]"}`}
      >
        {/* Intro / Beschreibung nur sichtbar, wenn noch nichts gesucht wurde */}
        <div
          className={`text-center mb-6 transition-opacity duration-300 ease-in-out ${hasSearched ? "opacity-0 h-0" : "opacity-100"}`}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-[var(--color-text)]">
            {t("introTitle")}
          </h2>
          <p className="text-[var(--color-text)]/80 text-lg md:text-xl max-w-2xl mx-auto"
            dangerouslySetInnerHTML={{ __html: t("introDescription") }}
            />
        </div>

        {/* Suchfeld + Filter */}
        <div className={`w-full flex flex-wrap gap-4 justify-center items-center mb-10`}>
          <div className="flex flex-1 max-w-lg rounded-lg shadow-sm overflow-hidden">
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              spellCheck={false}
              className="flex-1 px-4 py-3 bg-[var(--color-card)] text-[var(--color-text)] border border-transparent focus:outline-none transition"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-3 bg-[var(--color-primary)] text-[var(--color-primary-text)] font-medium hover:bg-[var(--color-primary)]/80 transition-shadow shadow-sm hover:shadow-md"
            >
              <Search size={20} strokeWidth={2.5} className="text-[var(--color-primary-text)]/90" />
            </button>
          </div>

          {/* Filter Button rechts daneben */}
            {(owner || (data?.user?.repositories?.nodes?.length ?? 0) > 0) && (
              <div
                className={`relative inline-block text-left transition-all duration-700 ease-in-out ${
                  hasSearched ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <button
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="inline-flex justify-center min-w-44 items-center rounded-lg px-4 py-3 bg-[var(--color-primary)] text-[var(--color-text)] hover:bg-[var(--color-primary)]/80 transition-shadow shadow-sm hover:shadow-md"
                >
                  {t("filterLanguages")}
                </button>
                {isDropdownOpen && (
                  <div className="absolute mt-2 w-56 rounded-lg shadow-md bg-[var(--color-card)] z-10">
                    <div className="py-1 max-h-60 overflow-y-auto custom-scrollbar !p-0">
                      {availableLanguages.map((lang) => {
                        const isSelected = selectedLanguages.includes(lang);
                        return (
                          <button
                            key={lang}
                            className={`w-full text-left px-4 py-2 text-sm text-[var(--color-text)] flex justify-between items-center transition
                              ${isSelected ? "bg-[var(--color-card)]/80 font-semibold" : "hover:bg-[var(--color-base)] hover:bg-opacity-80"}`}
                            onClick={() => {
                              setSelectedLanguages((prev) =>
                                prev.includes(lang)
                                  ? prev.filter((l) => l !== lang)
                                  : [...prev, lang]
                              );
                            }}
                          >
                            {lang}
                            {isSelected && <span className="font-bold">✔</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
        </div>
          {/* Loading / Error */}
          {loading && <p className="text-center text-[var(--color-text)]/70">{t("loading")}</p>}
          {error && <p className="text-center text-red-500">{t("error")}: {error.message}</p>}
      </div>

        {/* Repository Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRepos.map((repo: any) => {
            const totalSize = repo.languages.totalSize || 1;
            const sortedEdges = [...repo.languages.edges].sort((a, b) => b.size - a.size);

            const maxVisible = 5;
            const summary: { name: string; color: string | null; size: number }[] = [];
            let otherSize = 0;

            sortedEdges.forEach((edge, index) => {
              if (index < maxVisible) {
                summary.push({ name: edge.node.name, color: edge.node.color, size: edge.size });
              } else {
                otherSize += edge.size;
              }
            });

            if (otherSize > 0) summary.push({ name: "Other", color: "#6b7280", size: otherSize });

            const summaryWithPercent = summary.map((lang) => {
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
                    ? "cursor-not-allowed select-none  bg-[var(--color-card)]/60"
                    : "hover:shadow-2xl hover:scale-105 transform transition-all duration-300"}
                `}
              >
                {/* Titelzeile */}
                <div className="flex justify-between items-stretch">
                  <h3 className="text-xl py-2 font-semibold text-[var(--color-text)] flex-1">{repo.name}</h3>
                  {repo.isPrivate && (
                    <div className="flex items-center gap-4">
                      <div className="w-px bg-[var(--color-base)] h-full" />
                      <Lock
                        size={20}
                        strokeWidth={2.5}
                        className="text-[var(--color-text)]/90"
                        aria-label="Private repository"
                      />
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
          })}
        </div>
      </div>
    </div>
  );
}
