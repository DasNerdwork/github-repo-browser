import { render, screen } from "@testing-library/react";
import { RepoCard } from "../RepoCard";

const mockRepo = {
  name: "Test Repo",
  description: "A test repository",
  url: "https://github.com/test/test",
  isPrivate: false,
  languages: {
    totalSize: 100,
    edges: [
      { size: 70, node: { name: "TypeScript", color: "#3178c6" } },
      { size: 30, node: { name: "HTML", color: "#e34c26" } },
    ],
  },
};

describe("RepoCard Component", () => {
  it("renders repo name, description and languages", () => {
    render(<RepoCard repo={mockRepo} />);
    expect(screen.getByText("Test Repo")).toBeInTheDocument();
    expect(screen.getByText("A test repository")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("HTML")).toBeInTheDocument();
  });

  it("renders as link for public repo", () => {
    render(<RepoCard repo={mockRepo} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://github.com/test/test");
  });
});
