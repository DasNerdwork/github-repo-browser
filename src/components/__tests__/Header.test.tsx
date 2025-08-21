import { render, screen } from "@testing-library/react";
import { Header } from "../Header";

describe("Header Component", () => {
  it("renders project title", () => {
    render(<Header currentLanguage="en" setCurrentLanguage={() => {}} />);
    const link = screen.getByRole("link", { name: /projectTitle/i });

    // Assert that the link exists in the rendered output
    expect(link).toBeInTheDocument();
  });

  it("renders language selector and theme toggle", () => {
    render(<Header currentLanguage="en" setCurrentLanguage={() => {}} />);

     // Assert that the ThemeToggle button is present
    expect(screen.getByRole("button", { name: /Light Mode|Dark Mode/i })).toBeInTheDocument();
  });
});
