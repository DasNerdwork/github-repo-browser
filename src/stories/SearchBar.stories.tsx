import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SearchBar } from "../components/SearchBar";

const meta: Meta<typeof SearchBar> = {
  title: "Components/SearchBar",
  component: SearchBar,
};

export default meta;

type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {
  render: () => {
    const [username, setUsername] = useState("");
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const availableLanguages = ["JavaScript", "TypeScript", "HTML", "CSS"];

    const handleSearch = () => {
      alert(`Searching for user: ${username}\nSelected languages: ${selectedLanguages.join(", ")}`);
    };

    return (
      <SearchBar
        username={username}
        setUsername={setUsername}
        handleSearch={handleSearch}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        availableLanguages={availableLanguages}
        selectedLanguages={selectedLanguages}
        setSelectedLanguages={setSelectedLanguages}
        owner={username}
        hasSearched={true}
      />
    );
  },
};

export const NoLanguages: Story = {
  render: () => {
    const [username, setUsername] = useState("");
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
      <SearchBar
        username={username}
        setUsername={setUsername}
        handleSearch={() => {}}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        availableLanguages={[]}
        selectedLanguages={selectedLanguages}
        setSelectedLanguages={setSelectedLanguages}
        owner={username}
        hasSearched={true}
      />
    );
  },
};
