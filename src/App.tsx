import { gql, useLazyQuery  } from "@apollo/client";
import { useState } from "react";

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
  const [getRepos, { data, loading, error }] = useLazyQuery(GET_USER_REPOS);

  const handleSearch = () => {
    if (!username) return;
    setOwner(username); // speichern, damit wir es anzeigen können
    getRepos({ variables: { owner: username } });
  };

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
            {data.user.repositories.nodes.map((repo: any) => {
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