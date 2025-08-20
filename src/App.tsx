import { gql, useLazyQuery  } from "@apollo/client";
import { useState, useMemo } from "react";
import ThemeToggle from "./components/ThemeToggle";
import { Lock } from "lucide-react";

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
  const [username, setUsername] = useState("");
  const [owner, setOwner] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]); // Optional multiple filters for languages
  const [getRepos, { data, loading, error }] = useLazyQuery(GET_USER_REPOS);

  const handleSearch = () => {
    if (!username) return;
    setOwner(username); // speichern, damit wir es anzeigen können
    getRepos({ variables: { owner: username } });
  };

  const filteredRepos = useMemo(() => {
    if (!data?.user?.repositories?.nodes) return [];
    if (selectedLanguages.length === 0) return data.user.repositories.nodes;

    return data.user.repositories.nodes.filter((repo: any) =>
      selectedLanguages.every((lang) =>
        repo.languages.edges.some((edge: any) => edge.node.name === lang)
      )
    );
  }, [data, selectedLanguages]);

  const availableLanguages = useMemo(() => {
    if (!filteredRepos.length) return [];

    const set = new Set<string>();
    filteredRepos.forEach((repo: any) => {
      repo.languages.edges.forEach((edge: any) => {
        // Nur hinzufügen, wenn die Sprache noch nicht ausgewählt ist
        if (!selectedLanguages.includes(edge.node.name)) {
          set.add(edge.node.name);
        }
      });
    });

    return Array.from(set);
  }, [filteredRepos, selectedLanguages]);

  return (
    <div className="min-h-screen w-full bg-[var(--color-base)] text-[var(--color-text)]">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header mit ThemeToggle */}
        <div className="flex justify-end mb-6">
          <ThemeToggle />
        </div>

        {/* Search + Filter */}
        <div className="mb-6 flex gap-2 justify-center items-center">
          <input
            type="text"
            placeholder="Enter GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="px-4 py-2 w-64 rounded bg-[var(--color-card)] text-[var(--color-text)] border border-transparent focus:outline-none"
            style={{ boxShadow: "none" }}
          />

          {/* Language Filter Dropdown */}
          <div className="relative inline-block text-left">
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-[var(--color-card)] text-sm font-medium text-[var(--color-text)] hover:bg-opacity-90 transition"
            >
              Filter Languages
            </button>
            {isDropdownOpen && (
              <div className="absolute mt-2 w-56 rounded-md shadow-lg bg-[var(--color-card)] ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  {availableLanguages.map((lang) => (
                    <button
                      key={lang}
                      className="w-full text-left px-4 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-base)] hover:bg-opacity-20 flex justify-between"
                      onClick={() => {
                        setSelectedLanguages((prev) => [...prev, lang]);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {lang}
                      {selectedLanguages.includes(lang) && <span>✔</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Active Filters */}
        <div className="flex gap-2 flex-wrap mb-4">
          {selectedLanguages.map((lang) => (
            <span
              key={lang}
              className="px-3 py-1 rounded-full bg-[var(--color-card)] text-[var(--color-text)] cursor-pointer"
              onClick={() =>
                setSelectedLanguages((prev) => prev.filter((l) => l !== lang))
              }
            >
              {lang} ✕
            </span>
          ))}
        </div>

        {/* Loading / Error */}
        {loading && <p className="text-center text-[var(--color-text)]/70">Loading…</p>}
        {error && (
          <p className="text-center text-red-500">Error: {error.message}</p>
        )}

        {/* Repositories */}
        {data?.user?.repositories?.nodes.length > 0 && (
          <>
            <h1 className="text-3xl font-bold mb-6 text-center">
              Repositories of {owner}
            </h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredRepos.map((repo: any) => {
                const totalSize = repo.languages.totalSize || 1;

                // Sortiere Sprachen nach Größe absteigend
                const sortedEdges = [...repo.languages.edges].sort((a, b) => b.size - a.size);

                const maxVisible = 5; // maximal 5 sichtbar, alles ab 6. in "Other"
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
                  return {
                    ...lang,
                    percent: percent < 0.1 ? "<0.1" : percent.toFixed(1),
                  };
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
                    className={`
                      block bg-[var(--color-card)] rounded-lg shadow-lg px-4 pb-4
                      transition-shadow min-h-[240px]
                      ${repo.isPrivate ? "cursor-not-allowed" : "hover:shadow-2xl"}
                    `}
                  >
                  {/* Titelzeile */}
                  <div className="flex justify-between items-stretch">
                    <h2 className="text-xl py-2 font-semibold text-[var(--color-text)] flex-1">
                      {repo.name}
                    </h2>

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
                  <p className="text-sm text-[var(--color-text)]/50 mb-3 line-clamp-2 min-h-[2.5rem]">
                    {repo.description || "This project has no description."}
                  </p>

                  {/* Language bar */}
                  <div className="flex h-4 w-full rounded overflow-hidden mb-3 bg-[var(--color-base)]/20">
                    {summaryWithPercent.map((lang) => (
                      <div
                        key={lang.name}
                        className="h-full"
                        style={{
                          width: `${lang.percent}%`,
                          backgroundColor: lang.color || "#6b7280",
                        }}
                        title={`${lang.name}: ${lang.percent}%`}
                      />
                    ))}
                  </div>

                  {/* Language list */}
                  <ul className="grid grid-cols-2 gap-y-2 text-sm text-[var(--color-text)]/90">
                    {summaryWithPercent.map((lang) => (
                      <li key={lang.name} className="flex items-center">
                        <span
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: lang.color || "#6b7280" }}
                        />
                        <span>{lang.name}</span>
                        <span className="ml-1 text-[var(--color-text)]/60">{lang.percent}%</span>
                      </li>
                    ))}
                  </ul>
                </Wrapper>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}