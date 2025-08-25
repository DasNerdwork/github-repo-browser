import { RepoGrid } from "../components/RepoGrid";
import type { Meta, StoryObj } from "@storybook/react";
import type { Repository } from "../types";

// Mock repository data
const mockRepo: Repository = {
  name: "Example Repo",
  description: "This is a sample repository description for Storybook.",
  url: "https://github.com/example/repo",
  isPrivate: false,
  languages: {
    totalSize: 1000,
    edges: [
      { size: 400, node: { name: "TypeScript", color: "#3178c6" } },
      { size: 300, node: { name: "HTML", color: "#e34c26" } },
      { size: 200, node: { name: "CSS", color: "#563d7c" } },
      { size: 100, node: { name: "JSON", color: "#f1e05a" } },
    ],
  },
};

const meta: Meta<typeof RepoGrid> = {
  title: "Components/RepoGrid",
  component: RepoGrid,
};

export default meta;

type Story = StoryObj<typeof RepoGrid>;

export const Default: Story = {
  render: () => (
    <RepoGrid
      repos={[mockRepo, { ...mockRepo, name: "Another Repo" }, { ...mockRepo, name: "Repo Three" }]}
      hasSearched={true}
      setIsDropdownOpen={() => {}}
    />
  ),
};

export const EmptyState: Story = {
  render: () => <RepoGrid repos={[]} hasSearched={true} setIsDropdownOpen={() => {}} />,
};

export const LoadingState: Story = {
  render: () => <RepoGrid repos={[]} loading={true} hasSearched={true} setIsDropdownOpen={() => {}} />,
};
