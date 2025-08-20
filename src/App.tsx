import { gql, useLazyQuery  } from "@apollo/client";
import { useState, useMemo } from "react";

export const GET_USER_REPOS = gql`
  query UserRepos($owner: String!) {
    user(login: $owner) {
      repositories(first: 100, orderBy: { field: UPDATED_AT, direction: DESC }) {
        nodes {
          name
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

  const languages = useMemo(() => {
    if (!data?.user?.repositories?.nodes) return [];
    const set = new Set<string>();
    data.user.repositories.nodes.forEach((repo: any) => {
      repo.languages.edges.forEach((edge: any) => set.add(edge.node.name));
    });
    return Array.from(set);
  }, [data]);

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
    <div className="max-w-6xl mx-auto p-6">
      {/* Search Field */}
      <div className="mb-6 flex gap-2 justify-center">
        <input
          type="text"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border rounded px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Search
        </button>
      </div>
      
      {/* Active Filters */}
      <div className="flex gap-2 flex-wrap mb-4">
        {selectedLanguages.map((lang) => (
          <span
            key={lang}
            className="px-3 py-1 rounded-full bg-blue-500 text-white cursor-pointer"
            onClick={() =>
              setSelectedLanguages((prev) => prev.filter((l) => l !== lang))
            }
          >
            {lang} ✕
          </span>
        ))}
      </div>

      {/* Language Filter Dropdown */}
      <div className="relative inline-block text-left mb-6">
        <button
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Filter Languages
        </button>
        {isDropdownOpen && (
          <div className="absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
            <div className="py-1">
              {availableLanguages.map((lang) => (
                <button
                  key={lang}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex justify-between"
                  onClick={() => {
                    setSelectedLanguages((prev) => [...prev, lang])
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

      {/* Loading / Error */}
      {loading && <p className="text-center text-gray-400">Loading…</p>}
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
              return (
                <div
                  key={repo.name}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition-shadow"
                >
                  <h2 className="text-xl font-semibold mb-3">{repo.name}</h2>

                  {/* Language bar */}
                  <div className="flex h-4 w-full rounded overflow-hidden mb-3 bg-gray-200">
                    {repo.languages.edges.map((edge: any) => {
                      const percent = (edge.size / totalSize) * 100;
                      return (
                        <div
                          key={edge.node.name}
                          className="h-full"
                          style={{
                            width: `${percent}%`,
                            backgroundColor: edge.node.color || "#6b7280",
                          }}
                          title={`${edge.node.name}: ${percent.toFixed(1)}%`}
                        />
                      );
                    })}
                  </div>

                  {/* Language badges */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {repo.languages.edges.map((edge: any) => {
                      const percent = (edge.size / totalSize) * 100;
                      return (
                        <span
                          key={edge.node.name}
                          className="text-sm font-medium px-2 py-1 rounded-full text-white"
                          style={{
                            backgroundColor: edge.node.color || "#6b7280",
                          }}
                        >
                          {edge.node.name} {percent.toFixed(1)}%
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}