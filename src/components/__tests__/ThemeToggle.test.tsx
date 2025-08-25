import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggle from "../ThemeToggle";

describe("ThemeToggle Component", () => {
  it("renders a button", () => {
    render(<ThemeToggle />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("toggles dark/light mode on click", async () => {
    // Optional: lokalen Zustand auf "light" setzen, damit erster Klick dark aktiviert
    localStorage.setItem("theme", "light");

    render(<ThemeToggle />);
    const button = screen.getByRole("button");

    // Erstes Klick → dark = true
    await userEvent.click(button);
    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    // Zweites Klick → dark = false
    await userEvent.click(button);
    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });
  });
});
