import { render, screen } from "@testing-library/react";
import { RepoGrid } from "../RepoGrid";

const mockRepos = [
  {
    name: "Repo1",
    description: "Test 1",
    url: "https://github.com/test/repo1",
    isPrivate: false,
    languages: { totalSize: 50, edges: [] },
  },
  {
    name: "Repo2",
    description: "Test 2",
    url: "https://github.com/test/repo2",
    isPrivate: false,
    languages: { totalSize: 50, edges: [] },
  },
];

describe("RepoGrid Component", () => {
  it("renders all repositories", () => {
    render(<RepoGrid repos={mockRepos} loading={false} hasSearched={true} setIsDropdownOpen={() => {}} />);
    expect(screen.getByText("Repo1")).toBeInTheDocument();
    expect(screen.getByText("Repo2")).toBeInTheDocument();
  });

  it("renders noReposFound message when empty", () => {
    render(<RepoGrid repos={[]} loading={false} hasSearched={true} setIsDropdownOpen={() => {}} />);
    expect(screen.getByText(/noReposFound/i)).toBeInTheDocument();
  });
});
