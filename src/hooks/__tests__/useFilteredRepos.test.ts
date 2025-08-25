import { renderHook } from "@testing-library/react";
import { useFilteredRepos } from "../useFilteredRepos";
import type { Repository } from "../../types";

const mockRepos: Repository[] = [
  {
    name: "Repo1",
    description: "Test Repo",
    url: "https://github.com/test/repo1",
    isPrivate: false,
    languages: {
      totalSize: 100,
      edges: [
        { size: 50, node: { name: "TypeScript", color: "#3178c6" } },
        { size: 50, node: { name: "JavaScript", color: "#f7df1e" } },
      ],
    },
  },
  {
    name: "Repo2",
    description: "Another Repo",
    url: "https://github.com/test/repo2",
    isPrivate: true,
    languages: {
      totalSize: 100,
      edges: [
        { size: 100, node: { name: "Python", color: "#3572A5" } },
      ],
    },
  },
];

const mockData = {
  user: {
    repositories: {
      nodes: mockRepos,
      pageInfo: { hasNextPage: false }
    }
  }
};

describe("useFilteredRepos", () => {
  it("returns all repos if no language selected", () => {
    const { result } = renderHook(() => useFilteredRepos(mockData, []));
    expect(result.current.length).toBe(2);
  });

  it("filters repos by selected language", () => {
    const { result } = renderHook(() => useFilteredRepos(mockData, ["TypeScript"]));
    expect(result.current.length).toBe(1);
    expect(result.current[0].name).toBe("Repo1");
  });

  it("sorts public repos first", () => {
    const { result } = renderHook(() => useFilteredRepos(mockData, []));
    expect(result.current[0].isPrivate).toBe(false);
    expect(result.current[1].isPrivate).toBe(true);
  });
});
