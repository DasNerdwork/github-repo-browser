import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "../SearchBar";
import { vi } from "vitest";

describe("SearchBar Component", () => {
  const defaultProps = {
    username: "",
    setUsername: vi.fn(),
    handleSearch: vi.fn(),
    isDropdownOpen: false,
    setIsDropdownOpen: vi.fn(),
    availableLanguages: ["JavaScript", "TypeScript"],
    selectedLanguages: [],
    setSelectedLanguages: vi.fn(),
    owner: "dasnerdwork",
    hasSearched: false,
  };

  it("renders input and search button", () => {
    render(<SearchBar {...defaultProps} />);

    expect(screen.getByRole("textbox")).toBeInTheDocument();

    const searchButton = screen.getByRole("button", { name: /search/i });
    expect(searchButton).toBeInTheDocument();

    const filterButton = screen.getByRole("button", { name: /filterLanguages/i });
    expect(filterButton).toBeInTheDocument();
  });

  it("calls handleSearch on Enter key", async () => {
    render(<SearchBar {...defaultProps} />);
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "dasnerdwork{enter}");
    expect(defaultProps.handleSearch).toHaveBeenCalled();
  });
});
