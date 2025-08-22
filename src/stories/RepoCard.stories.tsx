import { RepoCard } from "../components/RepoCard";
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

const meta: Meta<typeof RepoCard> = {
  title: "Components/RepoCard",
  component: RepoCard,
};

export default meta;

type Story = StoryObj<typeof RepoCard>;

export const Default: Story = {
  render: () => <RepoCard repo={mockRepo} />,
};

export const PrivateRepo: Story = {
  render: () => <RepoCard repo={{ ...mockRepo, isPrivate: true, name: "Private Repo" }} />,
};
