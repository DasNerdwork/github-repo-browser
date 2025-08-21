import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggle from "../ThemeToggle";

describe("ThemeToggle Component", () => {
  it("renders a button", () => {
    render(<ThemeToggle />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("toggles dark/light mode on click", async () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(document.documentElement.classList.contains("dark")).toBeTruthy();
  });
});
