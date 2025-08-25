import { renderHook } from "@testing-library/react";
import { useAvailableLanguages } from "../useAvailableLanguages";
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
];

describe("useAvailableLanguages", () => {
  it("returns all languages if none selected", () => {
    const { result } = renderHook(() => useAvailableLanguages(mockRepos, []));
    expect(result.current).toEqual(["TypeScript", "JavaScript"]);
  });

  it("prioritizes selected languages first", () => {
    const { result } = renderHook(() => useAvailableLanguages(mockRepos, ["JavaScript"]));
    expect(result.current[0]).toBe("JavaScript");
    expect(result.current[1]).toBe("TypeScript");
  });
});
